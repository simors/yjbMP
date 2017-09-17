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
import io from 'socket.io-client'

const socket = io(appConfig.LC_SERVER_DOMAIN)


const {
  Button,
  Page,
  Dialog,
  Toast
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
      showLoading: false,
      loadingMessage: '加载中...',
      loadingIcon: 'loading',
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

  //触发支付动作
  triggerPayment(order) {
    var amount = this.getAmount(order)
    if(this.props.walletInfo.balance < amount) {  //余额不足
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

  triggerTurnOff(order) {
    var amount = this.getAmount(order)
    this.setState({
      showDialog: true,
      Dialog: {
        title: '关闭干衣柜',
        trip: '关机后请尽快取出衣物，并支付订单',
        buttons: [
          {
            type: 'default',
            label: '取消',
            onClick: () => {this.setState({showDialog: false})}
          },
          {
            type: 'primary',
            label: '关机',
            onClick: () => {this.trunOffDevice(order)}
          }
        ]
      },
    })
  }

  //关机
  trunOffDevice(order) {
    var that = this
    this.setState({showLoading: true, showDialog: false})
    //发送关机请求
    socket.emit(appConfig.TURN_OFF_DEVICE, {
      userId: this.props.currentUser.id,
      deviceNo: order.deviceNo,
      orderId: order.id
    }, function (data) {
      var errorCode = data.errorCode
      if(errorCode != 0) {
        that.setState({loadingMessage: "关机请求失败", loadingIcon: 'info'})
        console.log("关机请求失败", data.errorMessage)
        setTimeout(function () {
          that.setState({showLoading: false})
        }, 2000)
      }
    })

    socket.on(appConfig.TURN_OFF_DEVICE_SUCCESS, function (data) {
      console.log("收到关机成功消息", data)
      that.setState({loadingMessage: "关机成功", loadingIcon: 'success-circle'})
      setTimeout(function () {
        that.setState({showLoading: false})
        that.onClickNavBar(appConfig.ORDER_STATUS_UNPAID)
      }, 2000)
    })
    socket.on(appConfig.TURN_OFF_DEVICE_FAILED, function (data) {
      console.log("收到关机失败消息", data)
      that.setState({loadingMessage: "关机失败", loadingIcon: 'info'})
      setTimeout(function () {
        that.setState({showLoading: false})
      }, 2000)
    })
  }

  onButtonPress = () => {
    switch (this.props.orderInfo.status) {
      case appConfig.ORDER_STATUS_PAID:
        browserHistory.goBack()
        break
      case appConfig.ORDER_STATUS_UNPAID:
        this.triggerPayment(this.props.orderInfo)
        break
      case appConfig.ORDER_STATUS_OCCUPIED:
        this.triggerTurnOff(this.props.orderInfo)
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
        <Toast icon={this.state.loadingIcon} show={this.state.showLoading}>{this.state.loadingMessage}</Toast>
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