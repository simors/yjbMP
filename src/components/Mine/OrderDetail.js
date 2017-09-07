/**
 * Created by wanpeng on 2017/8/23.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import {selectOrderById, selectUserInfo} from '../../selector/authSelector'
import {paymentOrder} from '../../actions/authActions'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './orderDetail.css'
import {formatTime} from '../../util'
import {ORDER_STATUS_OCCUPIED, ORDER_STATUS_PAID, ORDER_STATUS_UNPAID} from '../../constants/appConfig'


const {
  Button,
  Page,
  Dialog,
} = WeUI

class OrderDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showPayDialog: false,
      PayDialog: {
        title: '确认支付',
        buttons: [
          {
            type: 'default',
            label: '取消',
            onClick: () => {this.setState({showPayDialog: false})}
          },
          {
            type: 'primary',
            label: '确认',
            onClick: this.onPaymentService
          }
        ]
      },
      showTripDialog: false,
      TripDialogTitle: '支付成功',
      TripDialog: {
        buttons: [
          {
            label: '确定',
            onClick: () => {
              this.setState({showTripDialog: false})
            }
          },
        ]
      }
    }
  }

  componentDidMount() {
    document.title = "订单详细"
  }

  getAmount(order) {
    let duration = 0
    switch (order.status) {
      case ORDER_STATUS_PAID:
        return order.amount
        break
      case ORDER_STATUS_UNPAID:
        duration = ((order.endTime - order.createTime) * 0.001 / 60).toFixed(0)
        break
      case ORDER_STATUS_OCCUPIED:
        duration = ((Date.now() - order.createTime) * 0.001 / 60).toFixed(0)
        break
      default:
        break
    }
    return (duration * order.unitPrice).toFixed(2)
  }

  getDuration(createTime) {
    let duration = ((Date.now() - createTime) * 0.001 / 60).toFixed(0) //分钟
    return duration
  }

  getButtonTitle(order) {
    switch (order.status) {
      case ORDER_STATUS_PAID:
        return "返回"
        break
      case ORDER_STATUS_UNPAID:
        return "支付"
        break
      case ORDER_STATUS_OCCUPIED:
        return "取出衣物"
        break
      default:
        break
    }
  }

  //触发支付动作
  triggerPayment(order) {
    var amount = this.getAmount(order)
    if(this.props.currentUser.balance < amount) {  //余额不足
      this.setState({
        showTripDialog: true,
        TripDialogTitle: '余额不足',
        TripDialog: {
          buttons: [
            {
              type: 'default',
              label: '返回',
              onClick: () => {
                this.setState({showTripDialog: false})
              }
            },
            {
              type: 'primary',
              label: '充值',
              onClick: () => {
                browserHistory.push('/mine/wallet/recharge')
                this.setState({showTripDialog: false})
              }
            }
          ]
        }
      })
    } else {
      this.setState({
        showPayDialog: true,
      })
    }
  }

  paymentServiceSuccessCallback = (orderRecord) => {
    console.log("orderRecord: status", orderRecord.status)
    if(orderRecord.status === ORDER_STATUS_PAID) {
      this.setState({
        showTripDialog: true,
        TripDialogTitle: '支付成功'
      })
    } else if(orderRecord.status === ORDER_STATUS_UNPAID) {
      this.setState({
        showTripDialog: true,
        TripDialogTitle: '余额不足'
      })
    }
  }

  paymentServiceFailedCallback = (error) => {
    console.log("onPaymentService", error)
  }

  //支付服务订单
  onPaymentService = () => {
    this.props.paymentOrder({
      userId: this.props.currentUser.id,
      amount: this.getAmount(this.props.orderInfo),
      orderId: this.props.orderInfo.id,
      success: this.paymentServiceSuccessCallback,
      error: this.paymentServiceFailedCallback,
    })
  }

  onButtonPress = () => {
    switch (this.props.orderInfo.status) {
      case ORDER_STATUS_PAID:
        browserHistory.goBack()
        break
      case ORDER_STATUS_UNPAID:
      case ORDER_STATUS_OCCUPIED:
        this.triggerPayment(this.props.orderInfo)
        break
      default:
        break
    }
  }

  render() {
    console.log("orderInfo", this.props.orderInfo)
    return(
      <Page style={{backgroundColor: `#EFEFF4`, overflow: `hidden`}}>
        <div className="item-area">
          <div className="order-detail-item">当前状态：正在烘干</div>
          <div className="order-detail-item">
            <div>{'订单编号：' + this.props.orderInfo.orderNo}</div>
            <div>{'下单时间：' + formatTime(this.props.orderInfo.createTime, 'YYYY/MM/DD HH:mm')}</div>
          </div>
          <div className="order-detail-item">
            <div>服务名称：普通干衣</div>
            <div>{'进行时长：' + this.getDuration(this.props.orderInfo.createTime) + '分钟'}</div>
            <div>所在柜门：13号</div>
          </div>
          <div className="order-detail-item">
            <div>{'衣柜编号：' + this.props.orderInfo.deviceNo}</div>
            <div>{'衣柜位置：' + this.props.orderInfo.deviceAddr}</div>
          </div>
          <div className="order-detail-item">
            {'实时计费：' + this.getAmount(this.props.orderInfo) + '元'}
          </div>
        </div>
        <div className="order-detail-buttom-area">
          <Button onClick={this.onButtonPress}>{this.getButtonTitle(this.props.orderInfo)}</Button>
        </div>
        <Dialog type="ios" title={this.state.PayDialog.title} buttons={this.state.PayDialog.buttons} show={this.state.showPayDialog}>
          {"即将使用余额支付，本次扣费" + this.getAmount(this.props.orderInfo) + "元"}
        </Dialog>
        <Dialog type="android" title={this.state.TripDialogTitle} buttons={this.state.TripDialog.buttons} show={this.state.showTripDialog}>
          请充值
        </Dialog>
      </Page>
    )
  }

}


const mapStateToProps = (state, ownProps) => {
  var orderId = ownProps.params.id
  return {
    currentUser: selectUserInfo(state),
    orderInfo: selectOrderById(state, orderId)
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  paymentOrder
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail)