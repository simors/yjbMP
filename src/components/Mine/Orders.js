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
} = WeUI

class Orders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderStatus: appConfig.ORDER_STATUS_OCCUPIED,
      showPayDialog: false,
      payAmount: 0,
      payOrderId: '',
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
    return (duration * order.unitPrice).toFixed(2)
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
            <div className="status">正在烘干</div>
            <text style={{fontSize: `1.5rem`}}>{this.getAmount(item) + '元'}</text>
          </div>
          <div className="order-content-secondary">
            <text>{item.deviceAddr}</text>
            <text>实时计费</text>
          </div>
        </div>
        <div className="order-footer">
          <div className="order-button" onClick={() => this.triggerPayment(item)}>取出衣物</div>
        </div>
      </Panel>
    )
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
        payAmount: Number(amount),
        payOrderId: order.id,
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
      amount: this.state.payAmount,
      orderId: this.state.payOrderId,
      success: this.paymentServiceSuccessCallback,
      error: this.paymentServiceFailedCallback,
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
            <div className="unpaid-status">已烘干</div>
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
      <Tab>
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
      <Dialog type="ios" title={this.state.PayDialog.title} buttons={this.state.PayDialog.buttons} show={this.state.showPayDialog}>
        {"即将使用余额支付，本次扣费" + this.state.payAmount + "元"}
      </Dialog>
      <Dialog type="ios" title={this.state.TripDialogTitle} buttons={this.state.TripDialog.buttons} show={this.state.showTripDialog}>
      </Dialog>
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