/**
 * Created by wanpeng on 2017/8/18.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import {fetchOrders, paymentOrder, updateOrder} from '../../actions/orderActions'
import {selectActiveUserInfo} from '../../selector/authSelector'
import {selectMyOrders} from '../../selector/orderSelector'
import * as appConfig from '../../constants/appConfig'
import {formatTime} from '../../util'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './orders.css'
import {socket} from '../../util/socket'
import * as errno from '../../errno'
import {Toast} from 'antd-mobile'

const {Panel, Tab, TabBody, InfiniteLoader, Cells, Icon, Dialog, Msg} = WeUI

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
      }
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


  paymentServiceSuccessCallback = (orderRecord) => {
    Toast.success("订单支付成功")
    browserHistory.push('/result' + '/订单支付成功' + '/success')
  }

  paymentServiceFailedCallback = (error) => {
    console.log("onPaymentService", error)
    switch (error.code) {
      case errno.EPERM:
        Toast.fail("用户未登录")
        break
      case errno.EINVAL:
        Toast.fail("参数错误")
        break
      case errno.ERROR_NO_ENOUGH_BALANCE:
        Toast.fail("余额不足")
        browserHistory.push('/mine/wallet/recharge')
        break
      default:
        Toast.fail("订单支付失败" + error.code)
        break
    }
  }

  //支付服务订单
  onPaymentService = () => {
    this.setState({showDialog: false})
    Toast.loading("请稍后", 10, () => {
      Toast.info("网络错误")
    })
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
    this.setState({showDialog: false})
    Toast.loading("请稍后", 15, () => {
      Toast.info("网络超时")
    })
    //发送关机请求
    socket.emit(appConfig.TURN_OFF_DEVICE, {
      userId: this.props.currentUser.id,
      deviceNo: order.deviceNo,
      orderId: order.id
    }, function (data) {
      var errorCode = data.errorCode
      let order = data.order
      if(order) { //订单已结束，设备已自动关机
        this.props.updateOrder({order: order})
        Toast.info("衣物已烘干，干衣柜自动关闭")
        return
      }
      if(errorCode != 0) {
        Toast.fail("关机请求失败")
      }
    })

    socket.on(appConfig.TURN_OFF_DEVICE_SUCCESS, function (data) {
      Toast.success("关机成功")
      browserHistory.push('/mine/orders/' + order.id)
    })

    socket.on(appConfig.TURN_OFF_DEVICE_FAILED, function (data) {
      Toast.fail("关机失败")
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
            <div className="order-content-fee">
              <text style={{fontSize: `1.1rem`, color: `#000000`}}>使用时长</text>
              <text style={{marginRight: '0.5rem'}}>{this.getDuration(item) + '分钟'}</text>
              <div className="status">已烘干</div>
            </div>
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
            <div className="order-content-fee">
              <text style={{fontSize: `1.1rem`, color: `#000000`}}>使用时长</text>
              <text style={{marginRight: '0.5rem'}}>{this.getDuration(item) + '分钟'}</text>
              <div className="status" style={{backgroundColor: `#FFA22A`}}>正在烘干</div>
            </div>
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
            <div className="order-content-fee">
              <text style={{fontSize: `1.1rem`, color: `#000000`}}>使用时长</text>
              <text style={{marginRight: '0.5rem'}}>{this.getDuration(item) + '分钟'}</text>
              <div className="status">已完成</div>
            </div>
            <text style={{fontSize: `1.5rem`}}>{this.getAmount(item) + '元'}</text>
          </div>
          <div className="order-content-secondary">
            <text>{item.deviceAddr}</text>
            <text>本次费用</text>
          </div>
        </div>
        <div className="order-footer">
          <div className="paid-success-trip"><Icon value="success"/>交易成功</div>
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
    const {orderList} = this.props
    if(orderList.length === 0) {
      return(
        <Msg
          type="info"
          title="没有订单记录！"
          footer={() =>(<img style={{width: '6.3rem', marginBottom: '3rem'}}  src={require('../../../public/logo_gray.png')} alt=""/>)}
        />
      )
    }
    return(
    <InfiniteLoader onLoadMore={this.onLoadMoreOrders} loaderDefaultIcon={null}>
      <Tab className="order-tab">
        <TabBody style={{backgroundColor: `#EFEFF4`}}>
          <Cells style={{backgroundColor: `#EFEFF4`, marginTop: `0.6rem`}}>
            {
              orderList.map((item, i) => {
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
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchOrders,
  paymentOrder,
  updateOrder,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Orders)