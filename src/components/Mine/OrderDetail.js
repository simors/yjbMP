/**
 * Created by wanpeng on 2017/8/23.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import {selectOrderById, selectUserInfo, selectWalletInfo} from '../../selector/authSelector'
import {paymentOrder} from '../../actions/authActions'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './orderDetail.css'
import {formatTime} from '../../util'
import * as appConfig from '../../constants/appConfig'


const {
  Button,
  Page,
  Dialog,
} = WeUI

class OrderDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showDialog: false,
      Dialog: {
        title: '确认支付',
        trip: '',
        buttons: [
          {
            type: 'default',
            label: '取消',
            onClick: () => {}
          },
          {
            type: 'primary',
            label: '确认',
            onClick: () => {}
          }
        ]
      },
    }
  }

  componentDidMount() {
    document.title = "订单详细"
  }

  getAmount(order) {
    let duration = 0
    switch (order.status) {
      case appConfig.ORDER_STATUS_PAID:
        return order.amount
        break
      case appConfig.ORDER_STATUS_UNPAID:
        duration = ((order.endTime - order.createTime) * 0.001 / 60).toFixed(0)
        break
      case appConfig.ORDER_STATUS_OCCUPIED:
        duration = ((Date.now() - order.createTime) * 0.001 / 60).toFixed(0)
        break
      default:
        break
    }
    duration = duration < 1? 1: duration
    return (duration * order.unitPrice).toFixed(2)
  }

  getDuration(createTime) {
    let duration = ((Date.now() - createTime) * 0.001 / 60).toFixed(0) //分钟
    return duration
  }

  getButtonTitle(order) {
    switch (order.status) {
      case appConfig.ORDER_STATUS_PAID:
        return "返回"
        break
      case appConfig.ORDER_STATUS_UNPAID:
        return "支付"
        break
      case appConfig.ORDER_STATUS_OCCUPIED:
        return "取出衣物"
        break
      default:
        break
    }
  }

  getOrderStatus(order) {
    switch (order.status) {
      case appConfig.ORDER_STATUS_PAID:
        return "已完成"
        break
      case appConfig.ORDER_STATUS_UNPAID:
        return "未支付"
        break
      case appConfig.ORDER_STATUS_OCCUPIED:
        return "正在烘干"
        break
      default:
        break
    }
  }

  //触发支付动作s
  triggerPayment(order) {
    var amount = this.getAmount(order)
    if(this.props.walletInfo.balance < amount) {  //余额不足
      if(order.status === appConfig.ORDER_STATUS_OCCUPIED) {
        this.setState({
          showDialog: true,
          Dialog: {
            title: '余额不足',
            trip: '请结束服务后充值',
            buttons: [
              {
                type: 'default',
                label: '取消',
                onClick: () => {this.setState({showDialog: false})}
              },
              {
                type: 'primary',
                label: '结束服务',
                onClick: this.onPaymentService
              }
            ]
          },
        })
      } else if(order.status === appConfig.ORDER_STATUS_UNPAID) {
        this.setState({
          showDialog: true,
          Dialog: {
            title: '余额不足',
            trip: '请充值后再试',
            buttons: [
              {
                type: 'default',
                label: '取消',
                onClick: () => {this.setState({showDialog: false})}
              },
              {
                type: 'primary',
                label: '充值',
                onClick: () => {
                  browserHistory.push('/mine/wallet/recharge')
                  this.setState({showDialog: false})
                }
              }
            ]
          },
        })
      }
    } else {
      this.setState({
        showDialog: true,
        Dialog: {
          title: '确认支付',
          trip: "即将使用余额支付，本次扣费" + amount + "元",
          buttons: [
            {
              type: 'default',
              label: '取消',
              onClick: () => {this.setState({showDialog: false})}
            },
            {
              type: 'primary',
              label: '确认',
              onClick: this.onPaymentService
            }
          ]
        },
      })
    }
  }

  paymentServiceSuccessCallback = (orderRecord) => {
    if(orderRecord.status === appConfig.ORDER_STATUS_PAID) {
      this.setState({
        showDialog: true,
        Dialog: {
          title: '支付成功',
          trip: '',
          buttons: [
            {
              label: '确定',
              onClick: () => {
                this.setState({showDialog: false})
              }
            },
          ]
        },
      })
    } else if(orderRecord.status === appConfig.ORDER_STATUS_UNPAID) {
      this.setState({
        showDialog: true,
        Dialog: {
          title: '干衣服务结束',
          trip: '',
          buttons: [
            {
              type: 'default',
              label: '返回',
              onClick: () => {this.setState({showDialog: false})}
            },
            {
              type: 'primary',
              label: '充值',
              onClick: () => {
                browserHistory.push('/mine/wallet/recharge')
                this.setState({showDialog: false})
              }
            }
          ]
        },
      })
    }
  }

  paymentServiceFailedCallback = (error) => {
    console.log("onPaymentService", error)
    //TODO 跳转到错误提示页面
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
      case appConfig.ORDER_STATUS_PAID:
        browserHistory.goBack()
        break
      case appConfig.ORDER_STATUS_UNPAID:
      case appConfig.ORDER_STATUS_OCCUPIED:
        this.triggerPayment(this.props.orderInfo)
        break
      default:
        break
    }
  }

  render() {

    return(
      <Page ptr={false} infiniteLoader={false} className="order-detail-page">
        <div className="item-area">
          <div className="order-detail-item">{"当前状态：" + this.getOrderStatus(this.props.orderInfo)}</div>
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
        <Dialog type="ios" title={this.state.Dialog.title} buttons={this.state.Dialog.buttons} show={this.state.showDialog}>{this.state.Dialog.trip}</Dialog>
      </Page>
    )
  }

}


const mapStateToProps = (state, ownProps) => {
  var orderId = ownProps.params.id
  return {
    currentUser: selectUserInfo(state),
    orderInfo: selectOrderById(state, orderId),
    walletInfo: selectWalletInfo(state)
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  paymentOrder
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail)