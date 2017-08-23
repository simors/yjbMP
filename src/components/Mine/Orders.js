/**
 * Created by wanpeng on 2017/8/18.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
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
      tab: 0,
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

  renderOrder = (item, i) => {
    return (
      <Panel key={i} onClick={() => {}}>
        <div className="order-header">
          <text>{'订单编号：' + item.id}</text>
          <text>{item.date}</text>
        </div>
        <div className="order-content">
          <div className="order-content-primary">
            <text style={{fontSize: `1.1rem`, color: `#000000`}}>{item.title}</text>
            <text>{item.duration}</text>
            <div className="status">{item.status}</div>
            <text style={{fontSize: `1.5rem`}}>{item.amount + '元'}</text>
          </div>
          <div className="order-content-secondary">
            <text>{item.address}</text>
            <text>{item.type}</text>
          </div>
        </div>
        <div className="order-footer">
          <div className="order-button">取出衣物</div>
        </div>
      </Panel>
    )
  }

  onLoadMoreOrders = (resolve, finish) => {
    if(this.state.tab === 0) {
      console.log("加载未支付订单")
      setTimeout(function () {
        resolve()
      }, 1000)
    } else if(this.state.tab === 1) {
      setTimeout(function () {
        resolve()
      }, 1000)
      console.log("加载已支付订单")
    }
  }

  render() {
    return(
    <InfiniteLoader onLoadMore={this.onLoadMoreOrders}>
      <Tab>
        <NavBar>
          <NavBarItem active={this.state.tab == 0} onClick={e=>this.setState({tab:0})}>未支付</NavBarItem>
          <NavBarItem active={this.state.tab == 1} onClick={e=>this.setState({tab:1})}>已完成</NavBarItem>
        </NavBar>
        <TabBody style={{backgroundColor: `#EFEFF4`}}>
          <Cells style={{display: this.state.tab == 0 ? null : 'none', backgroundColor: `#EFEFF4`, marginTop: `0.6rem`}}>
            {
              this.state.unpaidOrders.map(this.renderOrder)
            }
          </Cells>
          <Cells style={{display: this.state.tab == 1 ? null : 'none'}}>
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

  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Orders)