/**
 * Created by wanpeng on 2017/8/11.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import {selectActiveUserInfo, selectActiveUserId} from '../../selector/authSelector'
import {fetchPromCategoryAction} from '../../actions/promotionActions'
import {fetchOrders} from '../../actions/orderActions'
import {selectOrderByStatus} from '../../selector/orderSelector'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './mine.css'
import {ActivityIndicator} from 'antd-mobile'
import * as appConfig from '../../constants/appConfig'

const {
  Page,
  Cells,
  Cell,
  CellHeader,
  CellBody,
  CellFooter,
  Badge,
} = WeUI

class Mine extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {currentUserId} = this.props
    if(currentUserId) {
      this.props.fetchPromCategoryAction({})
      this.props.fetchOrders({
        limit: 2,
        isRefresh: true,
      })
    }
  }

  componentWillReceiveProps(newProps) {
    const {currentUserId} = this.props
    if(currentUserId != newProps.currentUserId) {
      this.props.fetchPromCategoryAction({})
      this.props.fetchOrders({
        limit: 2,
        isRefresh: true,
      })
    }
  }

  componentDidMount() {
    document.title = "个人中心"
  }

  renderOrderBadge() {
    const {activeOrderNum} = this.props
    if(activeOrderNum > 0) {
      return(<Badge preset="body">{activeOrderNum}</Badge>)
    } else {
      return null
    }
  }

  render() {
    const {currentUserId, activeOrderNum} = this.props
    if(!currentUserId) {
      return(<ActivityIndicator toast text="正在加载" />)
    }
    return (
      <Page ptr={false} style={{backgroundColor: `#EFEFF4`}}>
        <div className="container">
          <img src="/logo.png" alt="" style={{display: `block`, width: `7.5rem`, height: `6.75rem`}}/>
        </div>

        <Cells style={{marginTop: 0}}>
          <Cell access onClick={() => {browserHistory.push('/modifyProfile')}}>
            <CellHeader>
              <img src={this.props.currentUser.avatar || '/defaultAvatar.svg'} alt="" style={{display: `block`, width: `3.13rem`, marginRight: `0.63rem`}}/>
            </CellHeader>
            <CellBody primary={true}>
              <h6>{this.props.currentUser.nickname || '衣家宝'}</h6>
              <p style={{fontSize: `0.9rem`, marginTop: `0.1rem`}}>普通用户</p>
            </CellBody>
            <CellFooter style={{fontSize: `1.1rem`}}>
              修改资料
            </CellFooter>
          </Cell>
        </Cells>

        <Cells>
          <Cell access onClick={() => {browserHistory.push('/mine/score', {score: 100})}}>
            <CellHeader>
              <img src="/score.png" alt="" style={{display: `block`, width: `1.3rem`, marginRight: `1.1rem`}}/>
            </CellHeader>
            <CellBody>
              积分
            </CellBody>
            <CellFooter/>
          </Cell>
          <Cell access onClick={() => {browserHistory.push('/mine/wallet')}}>
            <CellHeader>
              <img src="/wallet.png" alt="" style={{display: `block`, width: `1.3rem`, marginRight: `1.1rem`}}/>
            </CellHeader>
            <CellBody>
              钱包
            </CellBody>
            <CellFooter/>
          </Cell>
          <Cell access onClick={() => {browserHistory.push('/mine/orders')}}>
            <CellHeader>
              <img src="/order.png" alt="" style={{display: `block`, width: `1.3rem`, marginRight: `1.1rem`}}/>
            </CellHeader>
            <CellBody>
              我的订单
              {this.renderOrderBadge()}
            </CellBody>
            <CellFooter/>
          </Cell>
        </Cells>
        <Cells>
          <Cell access onClick={() => {browserHistory.push('/about')}}>
            <CellHeader>
              <img src="/about_us.png" alt="" style={{display: `block`, width: `1.3rem`, marginRight: `1.1rem`}}/>
            </CellHeader>
            <CellBody>
              关于衣家宝
            </CellBody>
            <CellFooter/>
          </Cell>
        </Cells>
      </Page>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const unpaidOrders = selectOrderByStatus(state, appConfig.ORDER_STATUS_UNPAID)
  const occupiedOrders = selectOrderByStatus(state, appConfig.ORDER_STATUS_OCCUPIED)
  console.log("unpaidOrders", unpaidOrders)
  console.log("occupiedOrders", occupiedOrders)
  const activeOrderNum = (unpaidOrders? unpaidOrders.length: 0) + (occupiedOrders? occupiedOrders.length: 0)
  return {
    currentUserId: selectActiveUserId(state),
    currentUser: selectActiveUserInfo(state),
    activeOrderNum: activeOrderNum,
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchPromCategoryAction,
  fetchOrders,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Mine)