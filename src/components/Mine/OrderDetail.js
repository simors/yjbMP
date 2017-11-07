/**
 * Created by wanpeng on 2017/8/23.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import {selectActiveUserInfo, selectWalletInfo} from '../../selector/authSelector'
import {selectOrderById} from '../../selector/orderSelector'
import {selectDeviceById} from '../../selector/deviceSelector'
import {selectStationById} from '../../selector/stationSelector'
import {paymentOrder, fetchOrders} from '../../actions/orderActions'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import {formatTime} from '../../util'
import * as appConfig from '../../constants/appConfig'
import io from 'socket.io-client'
import * as errno from '../../errno'
import {Toast, Card, WhiteSpace, Flex} from 'antd-mobile'

const socket = io(appConfig.LC_SERVER_DOMAIN)

const {
  Button,
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
      }
    }
  }

  componentWillMount() {
    this.props.fetchOrders({
      limit: 10,
      isRefresh: true,
    })
  }

  componentDidMount() {
    document.title = "订单详细"
  }

  getAmount(order) {
    let duration = 0
    switch (order.status) {
      case appConfig.ORDER_STATUS_PAID:
      case appConfig.ORDER_STATUS_UNPAID:
        return order.amount
        break
      case appConfig.ORDER_STATUS_OCCUPIED:
        return ((new Date(order.endTime) - new Date(order.createTime)) * 0.001 / 60).toFixed(0)
        break
      default:
        break
    }
    duration = duration < 1? 1: duration
    return (duration * this.props.stationInfo.unitPrice).toFixed(2)
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
        return (<span style={{color: 'green'}}>已完成</span>)
        break
      case appConfig.ORDER_STATUS_UNPAID:
        return (<span style={{color: 'red'}}>未支付</span>)
        break
      case appConfig.ORDER_STATUS_OCCUPIED:
        return (<span style={{color: 'red'}}>正在烘干</span>)
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
    browserHistory.push('/result' + '/订单支付成功' + '/success')
  }

  paymentServiceFailedCallback = (error) => {
    switch (error.code) {
      case errno.EPERM:
        Toast.fail("用户未登录")
        break
      case errno.EINVAL:
        Toast.fail("参数错误")
        break
      case errno.ERROR_NO_ENOUGH_BALANCE:
        Toast.fail("余额不足")
        break
      default:
        Toast.fail("内部错误" + error.code)
        break
    }
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
    Toast.loading("处理中...", 15, () => {
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
      browserHistory.goBack()
    })

    socket.on(appConfig.TURN_OFF_DEVICE_FAILED, function (data) {
      Toast.fail("关机失败")
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

  render() {
    const {orderInfo, deviceInfo} = this.props
    return(
      <div style={{display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between'}}>
        <div>
          <WhiteSpace size="lg" />
          <Card>
            <Card.Header title="普通干衣" extra={this.getOrderStatus(orderInfo)}/>
            <Card.Body>
              <Flex>
                <div>订单编号</div>
                <Flex.Item>{orderInfo.orderNo}</Flex.Item>
              </Flex>
              <Flex>
                <div>下单时间</div>
                <Flex.Item>{formatTime(orderInfo.createTime, 'YYYY/MM/DD HH:mm')}</Flex.Item>
              </Flex>
              <Flex>
                <div>进行时长</div>
                <Flex.Item>{this.getDuration(orderInfo) + '分钟'}</Flex.Item>
              </Flex>
              <Flex>
                <div>衣柜编号</div>
                <Flex.Item>{deviceInfo.deviceNo}</Flex.Item>
              </Flex>
              <Flex>
                <div>衣柜位置</div>
                <Flex.Item>{deviceInfo.deviceAddr}</Flex.Item>
              </Flex>
              <Flex>
                <div>实时计费</div>
                <Flex.Item>{this.getAmount(orderInfo) + '元'}</Flex.Item>
              </Flex>
            </Card.Body>
          </Card>
        </div>
        <div style={{padding: '1.2rem'}}>
          <Button onClick={this.onButtonPress}>{this.getButtonTitle(this.props.orderInfo)}</Button>
          <Dialog type="ios" title={this.state.Dialog.title} buttons={this.state.Dialog.buttons} show={this.state.showDialog}>
            {this.state.Dialog.trip}
          </Dialog>
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  var orderId = ownProps.params.id
  let orderInfo = selectOrderById(state, orderId)
  let deviceInfo = orderInfo? selectDeviceById(state, orderInfo.deviceId) : undefined
  let stationInfo = deviceInfo? selectStationById(state, deviceInfo.stationId) : undefined
  return {
    currentUser: selectActiveUserInfo(state),
    deviceInfo: deviceInfo,
    stationInfo: stationInfo,
    orderInfo: orderInfo,
    walletInfo: selectWalletInfo(state)
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchOrders,
  paymentOrder
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail)