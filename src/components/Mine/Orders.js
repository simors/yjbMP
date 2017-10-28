/**
 * Created by wanpeng on 2017/8/18.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import {fetchOrders, paymentOrder, updateOrder} from '../../actions/orderActions'
import {selectActiveUserInfo, selectWalletInfo} from '../../selector/authSelector'
import {selectMyOrders} from '../../selector/orderSelector'
import * as appConfig from '../../constants/appConfig'
import {formatTime} from '../../util'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './orders.css'
import io from 'socket.io-client'
import * as errno from '../../errno'

const socket = io(appConfig.LC_SERVER_DOMAIN)

const {Panel, Tab, TabBody, InfiniteLoader, Cells, Icon, Dialog, Toast} = WeUI

class Orders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      payAmount: 0,
      payOrderId: '',
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
    document.title = "我的订单"
  }

  componentWillMount() {
    this.props.fetchOrders({
      limit: 10,
      isRefresh: true,
    })
  }

  getDuration(order) {
    switch (order.status) {
      case appConfig.ORDER_STATUS_PAID:
      case appConfig.ORDER_STATUS_UNPAID:
        return ((new Date(order.endTime) - new Date(order.createTime)) * 0.001 / 60).toFixed(0)
        break
      case appConfig.ORDER_STATUS_OCCUPIED:
        return ((Date.now() - new Date(order.createTime)) * 0.001 / 60).toFixed(0)
        break
      default:
        return 0
        break
    }
  }

  getAmount(order) {
    let duration = 0
    switch (order.status) {
      case appConfig.ORDER_STATUS_PAID:
      case appConfig.ORDER_STATUS_UNPAID:
        return order.amount
        break
      case appConfig.ORDER_STATUS_OCCUPIED:
        duration = ((Date.now() - new Date(order.createTime)) * 0.001 / 60).toFixed(0)
        break
      default:
        break
    }
    duration = duration < 1? 1: duration
    return (duration * order.unitPrice).toFixed(2)
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
        payAmount: Number(amount),
        payOrderId: order.id,
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
    let that = this
    console.log("onPaymentService", error)
    switch (error.code) {
      case errno.EPERM:
        this.setState({showLoading: true, loadingMessage: "用户未登录", loadingIcon: 'warn'})
        break
      case errno.EINVAL:
        this.setState({showLoading: true, loadingMessage: "参数错误", loadingIcon: 'warn'})
        break
      case errno.ERROR_NO_ENOUGH_BALANCE:
        this.setState({showLoading: true, loadingMessage: "余额不足", loadingIcon: 'warn'})
        break
      default:
        this.setState({showLoading: true, loadingMessage: "内部错误：" + error.code, loadingIcon: 'warn'})
        break
    }
    setTimeout(function () {
      that.setState({showLoading: false})
    }, 2000)
  }

  //支付服务订单
  onPaymentService = () => {
    this.props.paymentOrder({
      userId: this.props.currentUser.id,
      amount: this.state.payAmount,
      orderId: this.state.payOrderId,
      success: this.paymentServiceSuccessCallback,
      error: this.paymentServiceFailedCallback,
    })
  }


  triggerTurnOff(order) {
    var amount = this.getAmount(order)
    this.setState({
      payAmount: Number(amount),
      payOrderId: order.id,
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
      let order = data.order
      if(order) { //订单已结束，设备已自动关机
        console.log('trunOffDevice socket.emit ack: order', order)
        this.props.updateOrder({order: order})
        that.setState({loadingMessage: "衣物已烘干，干衣柜自动关闭", loadingIcon: 'info'})
        setTimeout(function () {
          that.setState({showLoading: false})
        }, 2000)
        return
      }
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

  renderUnpaidOrder(item, i) {
    return (
      <Panel key={i}>
        <div className="order-header">
          <text>{'订单编号：' + item.orderNo}</text>
          <text>{formatTime(item.createTime, 'YYYY/MM/DD HH:mm')}</text>
        </div>
        <div className="order-content" onClick={() => {browserHistory.push('/mine/orders/' + item.id)}}>
          <div className="order-content-primary">
            <text style={{fontSize: `1.1rem`, color: `#000000`}}>使用时长</text>
            <text>{this.getDuration(item) + '分钟'}</text>
            <div className="status">已烘干</div>
            <text style={{fontSize: `1.5rem`}}>{this.getAmount(item) + '元'}</text>
          </div>
          <div className="order-content-secondary">
            <text>{item.deviceAddr}</text>
            <text className="unpaid-trip">待支付费用</text>
          </div>
        </div>
        <div className="order-footer">
          <div className="pay-button" onClick={() => this.triggerPayment(item)}>支付</div>
        </div>
      </Panel>
    )
  }

  renderOccupiedOrder(item, i) {
    return (
      <Panel key={i}>
        <div className="order-header">
          <text>{'订单编号：' + item.orderNo}</text>
          <text>{formatTime(item.createTime, 'YYYY/MM/DD HH:mm')}</text>
        </div>
        <div className="order-content" onClick={() => {browserHistory.push('/mine/orders/' + item.id)}}>
          <div className="order-content-primary">
            <text style={{fontSize: `1.1rem`, color: `#000000`}}>使用时长</text>
            <text>{this.getDuration(item) + '分钟'}</text>
            <div className="status" style={{backgroundColor: `#FFA22A`}}>正在烘干</div>
            <text style={{fontSize: `1.5rem`}}>{this.getAmount(item) + '元'}</text>
          </div>
          <div className="order-content-secondary">
            <text>{item.deviceAddr}</text>
            <text>实时计费</text>
          </div>
        </div>
        <div className="order-footer">
          <div className="order-button" onClick={() => this.triggerTurnOff(item)}>取出衣物</div>
        </div>
      </Panel>
    )
  }

  renderPaidOrder(item, i) {
    return (
      <Panel key={i} onClick={() => {browserHistory.push('/mine/orders/' + item.id )}}>
        <div className="order-header">
          <text>{'订单编号：' + item.orderNo}</text>
          <text>{formatTime(item.createTime, 'YYYY/MM/DD HH:mm')}</text>
        </div>
        <div className="order-content" onClick={() => {browserHistory.push('/mine/orders/' + item.id)}}>
          <div className="order-content-primary">
            <text style={{fontSize: `1.1rem`, color: `#000000`}}>使用时长</text>
            <text>{this.getDuration(item) + '分钟'}</text>
            <div className="status">已完成</div>
            <text style={{fontSize: `1.5rem`}}>{this.getAmount(item) + '元'}</text>
          </div>
          <div className="order-content-secondary">
            <text>{item.deviceAddr}</text>
            <text>本次费用</text>
          </div>
        </div>
        <div className="order-footer">
          <div className="paid-success-trip"><Icon value="success"/> 交易成功</div>
        </div>
      </Panel>
    )
  }

  onLoadMoreOrders = (resolve, finish) => {
    this.props.fetchOrders({
      isRefresh: false,
      lastTurnOnTime: this.props.lastTurnOnTime,
      success: (orders) => {
        orders.length === 0? finish() : resolve()
      },
      error: (error) => {console.log(error)}
    })
  }

  render() {
    return(
    <InfiniteLoader onLoadMore={this.onLoadMoreOrders}>
      <Tab className="order-tab">
        <TabBody style={{backgroundColor: `#EFEFF4`}}>
          <Cells style={{backgroundColor: `#EFEFF4`, marginTop: `0.6rem`}}>
            {
              this.props.orderList.map((item, i) => {
                switch (item.status) {
                  case appConfig.ORDER_STATUS_UNPAID:
                    return this.renderUnpaidOrder(item, i)
                  case appConfig.ORDER_STATUS_OCCUPIED:
                    return this.renderOccupiedOrder(item, i)
                  case appConfig.ORDER_STATUS_PAID:
                    return this.renderPaidOrder(item, i)
                  default:
                    return null
                }
              })
            }
          </Cells>
        </TabBody>
      </Tab>
      <Dialog type="ios" title={this.state.Dialog.title} buttons={this.state.Dialog.buttons} show={this.state.showDialog}>{this.state.Dialog.trip}</Dialog>
      <Toast icon={this.state.loadingIcon} show={this.state.showLoading}>{this.state.loadingMessage}</Toast>
    </InfiniteLoader>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let orderList = selectMyOrders(state)
  let lastTurnOnTime = undefined
  if(orderList.length > 0) {
    lastTurnOnTime = orderList[orderList.length - 1].createTime
  }
  return {
    currentUser: selectActiveUserInfo(state),
    orderList: orderList,
    lastTurnOnTime: lastTurnOnTime,
    walletInfo: selectWalletInfo(state)
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchOrders,
  paymentOrder,
  updateOrder
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Orders)