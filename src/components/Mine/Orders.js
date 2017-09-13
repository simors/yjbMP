/**
 * Created by wanpeng on 2017/8/18.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import {fetchOrders, paymentOrder} from '../../actions/authActions'
import {selectUserInfo, selectUnpaidOrders, selectOccupiedOrders, selectPaidOrders} from '../../selector/authSelector'
import * as appConfig from '../../constants/appConfig'
import {formatTime} from '../../util'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './orders.css'
import io from 'socket.io-client'

const socket = io(appConfig.LC_SERVER_DOMAIN)

const {
  Panel,
  Tab,
  NavBar,
  NavBarItem,
  TabBody,
  InfiniteLoader,
  Cells,
  Icon,
  Dialog,
  Popup,
  LoadMore,
  Toast,
} = WeUI

class Orders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderStatus: appConfig.ORDER_STATUS_OCCUPIED,
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
    document.title = "历史订单"
  }

  componentWillMount() {
    this.props.fetchOrders({
      userId: this.props.currentUser.id,
      orderStatus: appConfig.ORDER_STATUS_OCCUPIED,
      limit: 10,
      isRefresh: true,
    })
  }

  getDuration(order) {
    switch (order.status) {
      case appConfig.ORDER_STATUS_PAID:
      case appConfig.ORDER_STATUS_UNPAID:
        return ((order.endTime - order.createTime) * 0.001 / 60).toFixed(0)
        break
      case appConfig.ORDER_STATUS_OCCUPIED:
        return ((Date.now() - order.createTime) * 0.001 / 60).toFixed(0)
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

  //触发支付动作
  triggerPayment(order) {
    var amount = this.getAmount(order)
    if(this.props.currentUser.balance < amount) {  //余额不足
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
    console.log("onPaymentService", error)
    //TODO 跳转到错误提示页面
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

  renderUnpaidOrder = (item, i) => {
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

  renderOccupiedOrder = (item, i) => {
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

  renderPaidOrder = (item, i) => {
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
      userId: this.props.currentUser.id,
      orderStatus: this.state.orderStatus,
      isRefresh: false,
      lastTurnOnTime: '',
      success: (orders) => {
        orders.length === 0? finish() : resolve()
      },
      error: (error) => {console.log(error)}
    })
  }

  onClickNavBar(status) {
    this.setState({orderStatus: status})
    this.props.fetchOrders({
      userId: this.props.currentUser.id,
      orderStatus: status,
      limit: 10,
      isRefresh: true,
    })
  }

  render() {
    return(
    <InfiniteLoader onLoadMore={this.onLoadMoreOrders}>
      <Tab className="order-tab">
        <NavBar>
          <NavBarItem active={this.state.orderStatus == appConfig.ORDER_STATUS_UNPAID}
                      onClick={e=>{this.onClickNavBar(appConfig.ORDER_STATUS_UNPAID)}}>
            未支付
          </NavBarItem>
          <NavBarItem active={this.state.orderStatus == appConfig.ORDER_STATUS_OCCUPIED}
                      onClick={e=>{this.onClickNavBar(appConfig.ORDER_STATUS_OCCUPIED)}}>
            使用中
          </NavBarItem>
          <NavBarItem active={this.state.orderStatus == appConfig.ORDER_STATUS_PAID}
                      onClick={e=>{this.onClickNavBar(appConfig.ORDER_STATUS_PAID)}}>
            已完成
          </NavBarItem>
        </NavBar>
        <TabBody style={{backgroundColor: `#EFEFF4`}}>
          <Cells style={{display: this.state.orderStatus == appConfig.ORDER_STATUS_UNPAID ? null : 'none', backgroundColor: `#EFEFF4`, marginTop: `0.6rem`}}>
            {
              this.props.unpaidOrders.map(this.renderUnpaidOrder)
            }
          </Cells>
          <Cells style={{display: this.state.orderStatus == appConfig.ORDER_STATUS_OCCUPIED ? null : 'none', backgroundColor: `#EFEFF4`, marginTop: `0.6rem`}}>
            {
              this.props.occupiedOrders.map(this.renderOccupiedOrder)
            }
          </Cells>
          <Cells style={{display: this.state.orderStatus == appConfig.ORDER_STATUS_PAID ? null : 'none', backgroundColor: `#EFEFF4`, marginTop: `0.6rem`}}>
            {
              this.props.paidOrders.map(this.renderPaidOrder)
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
  return {
    currentUser: selectUserInfo(state),
    unpaidOrders: selectUnpaidOrders(state),
    paidOrders: selectPaidOrders(state),
    occupiedOrders: selectOccupiedOrders(state)
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchOrders,
  paymentOrder
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Orders)