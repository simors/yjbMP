/**
 * Created by wanpeng on 2017/8/18.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {fetchOrders} from '../../actions/authActions'
import {selectUserInfo, selectUnpaidOrders, selectOccupiedOrders, selectPaidOrders} from '../../selector/authSelector'
import {ORDER_STATUS_OCCUPIED, ORDER_STATUS_PAID, ORDER_STATUS_UNPAID} from '../../constants/appConfig'
import {formatTime} from '../../util'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './orders.css'

const {
  Button,
  Panel,
  Page,
  PanelHeader,
  PanelBody,
  PanelFooter,
  MediaBox,
  MediaBoxTitle,
  MediaBoxDescription,
  Tab,
  NavBar,
  NavBarItem,
  TabBody,
  InfiniteLoader,
  Cells,
  Cell,
  CellHeader,
  CellBody,
  CellMore,
  CellFooter,
} = WeUI

class Orders extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderStatus: ORDER_STATUS_OCCUPIED,
      unpaidOrders: [
        {title: '普通干衣服务', id: '123456789', date: '2017/08/04 15:32', address: '中电软件园13栋2号柜13门', duration: '0:34:43', type: '实时计费', amount: 8.3, status: '已取出'},
        {title: '普通干衣服务', id: '123456789', date: '2017/08/04 15:32', address: '中电软件园13栋2号柜13门', duration: '0:34:43', type: '实时计费', amount: 8.3, status: '已取出'},
      ],
      prepaidOrders: [
        {title: '已支付订单-0'},
        {title: '已支付订单-1'},
        {title: '已支付订单-2'},
        {title: '已支付订单-3'},
        {title: '已支付订单-4'},
        {title: '已支付订单-5'},
        {title: '已支付订单-5'},
        {title: '已支付订单-5'},
        {title: '已支付订单-5'},
        {title: '已支付订单-5'},
        {title: '已支付订单-5'},
        {title: '已支付订单-5'},
        {title: '已支付订单-5'},
        {title: '已支付订单-5'},
        {title: '已支付订单-5'},
        {title: '已支付订单-5'},
      ],
    }
  }

  componentDidMount() {
    document.title = "历史订单"
  }

  componentWillMount() {
    this.props.fetchOrders({
      userId: this.props.currentUser.id,
      orderStatus: ORDER_STATUS_OCCUPIED,
      limit: 10,
      isRefresh: true,
    })
  }

  getDuration(createTime) {
    let duration = ((Date.now() - createTime) * 0.001 / 60).toFixed(0) //分钟
    return duration
  }

  getStatus(status) {
    if(status === ORDER_STATUS_OCCUPIED) {
      return '正在烘干'
    } else if(status === ORDER_STATUS_PAID) {
      return '已完成'
    } else if(status === ORDER_STATUS_UNPAID) {
      return '已烘干'
    }
  }

  renderOrder = (item, i) => {
    return (
      <Panel key={i} onClick={() => {}}>
        <div className="order-header">
          <text>{'订单编号：' + item.orderNo}</text>
          <text>{formatTime(item.createTime, 'YYYY/MM/DD HH:mm')}</text>
        </div>
        <div className="order-content">
          <div className="order-content-primary">
            <text style={{fontSize: `1.1rem`, color: `#000000`}}>使用时长</text>
            <text>{this.getDuration(item.createTime) + '分钟'}</text>
            <div className="status">{this.getStatus(item.status)}</div>
            <text style={{fontSize: `1.5rem`}}>{item.amount + '元'}</text>
          </div>
          <div className="order-content-secondary">
            <text>{item.deviceAddr}</text>
            <text>实时计费</text>
          </div>
        </div>
        <div className="order-footer">
          <div className="order-button">取出衣物</div>
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

  render() {
    return(
    <InfiniteLoader onLoadMore={this.onLoadMoreOrders}>
      <Tab>
        <NavBar>
          <NavBarItem active={this.state.orderStatus == ORDER_STATUS_UNPAID}
                      onClick={e=>this.setState({orderStatus: ORDER_STATUS_UNPAID})}>
            未支付
          </NavBarItem>
          <NavBarItem active={this.state.orderStatus == ORDER_STATUS_OCCUPIED}
                      onClick={e=>this.setState({orderStatus: ORDER_STATUS_OCCUPIED})}>
            使用中
          </NavBarItem>
          <NavBarItem active={this.state.orderStatus == ORDER_STATUS_PAID}
                      onClick={e=>this.setState({orderStatus: ORDER_STATUS_PAID})}>
            已完成
          </NavBarItem>
        </NavBar>
        <TabBody style={{backgroundColor: `#EFEFF4`}}>
          <Cells style={{display: this.state.orderStatus == ORDER_STATUS_UNPAID ? null : 'none', backgroundColor: `#EFEFF4`, marginTop: `0.6rem`}}>
            {
              this.props.unpaidOrders.map(this.renderOrder)
            }
          </Cells>
          <Cells style={{display: this.state.orderStatus == ORDER_STATUS_OCCUPIED ? null : 'none', backgroundColor: `#EFEFF4`, marginTop: `0.6rem`}}>
            {

            }
          </Cells>
          <Cells style={{display: this.state.orderStatus == ORDER_STATUS_PAID ? null : 'none'}}>
            {
              this.state.prepaidOrders.map((item, i) => {
                return (
                  <Cell key={i} access onClick={() => {}}>
                    <CellBody>
                      <div>{item.title}</div>
                    </CellBody>
                  </Cell>
                )
              })
            }
          </Cells>
        </TabBody>
      </Tab>
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
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Orders)