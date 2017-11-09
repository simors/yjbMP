/**
 * Created by wanpeng on 2017/8/18.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import WeUI from 'react-weui'
import {fetchDealRecords} from '../../actions/authActions'
import {selectActiveUserInfo, selectDealList} from '../../selector/authSelector'
import * as appConfig from '../../constants/appConfig'
import {formatTime} from  '../../util'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './wallet-detail.css'
import {Toast} from 'antd-mobile'
import * as errno from '../../errno'


const {
  Page,
  InfiniteLoader,
  Cells,
  Cell,
  CellBody,
  Icon,
  LoadMore,
} = WeUI

class WalletDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      total: undefined,
    }
  }

  componentWillMount() {
    this.props.fetchDealRecords({
      userId: this.props.currentUser.id,
      isRefresh: true,
      limit: 10,
      success: (total) => {this.setState({total})},
      error: this.onFetchDealRecordsError,
    })
  }

  onFetchDealRecordsError = (error) => {
    switch (error.code) {
      case errno.EPERM:
        Toast.fail("用户未登录")
        break
      case errno.ERROR_NO_USER:
        Toast.fail("用户不存在")
        break
      default:
        Toast.fail("查询用户消费记录错误：" + error.code)
        break
    }
  }

  componentDidMount() {
    document.title = "消费明细"
  }

  onLoadMoreRecord = (resolve, finish) => {
    const {total} = this.state
    const {dealRecords, currentUser, fetchDealRecords} = this.props
    const lastDealTime = dealRecords.length > 0? dealRecords[dealRecords.length - 1].dealTime : undefined
    if(dealRecords.length === total) {
      finish()
      return
    }
    fetchDealRecords({
      userId: currentUser.id,
      isRefresh: false,
      lastDealTime: lastDealTime,
      limit: 10,
      success: () => {
        resolve()
      },
      error: this.onFetchDealRecordsError,
    })
  }

  showRecordDetail(record) {

  }

  getDealTitle(record) {
    switch (record.dealType) {
      case appConfig.DEPOSIT:
        return "付款成功-押金"
      case appConfig.RECHARGE:
        return "付款成功-充值"
      case appConfig.SERVICE:
        return "付款成功-干衣"
      case appConfig.REFUND:
        return "退款成功-押金"
      case appConfig.WITHDRAW:
        return "提现成功-余额"
      case appConfig.SYS_PRESENT:
        return "付款成功-充值"
      case appConfig.ORDER_PAY:
        return "付款成功-订单"
      default:
        break
    }
  }

  getDealType(record) {
    switch (record.dealType) {
      case appConfig.DEPOSIT:
        return "押金"
      case appConfig.RECHARGE:
        return "平台充值"
      case appConfig.SERVICE:
        return "干衣消费"
      case appConfig.REFUND:
        return "押金退款"
      case appConfig.WITHDRAW:
        return "余额提现"
      case appConfig.SYS_PRESENT:
        return "系统赠送"
      case appConfig.ORDER_PAY:
        return "订单支付"
      default:
        break
    }
  }

  render(){
    return (
    <InfiniteLoader onLoadMore={this.onLoadMoreRecord} loaderDefaultIcon={null}>
      <Cells>
        {
          this.props.dealRecords.map( (item, i) => {
            return (
              <Cell key={i} access onClick={() => {this.showRecordDetail(item)}}>
                <CellBody>
                  <div className="wallet_detail_record">
                    <div className="record-header">
                      <text className="content-primary">{this.getDealTitle(item)}</text>
                      <text className="content-trip">{formatTime((new Date(item.dealTime)).getTime(),'YYYY-MM-DD HH:mm')}</text>
                    </div>
                    <div className="record-content">
                      <text className="content-primary">{item.amount + '元'}</text>
                      <text className="content-trip">{this.getDealType(item)}</text>
                    </div>
                  </div>
                </CellBody>
              </Cell>
            )
          })
        }
      </Cells>
    </InfiniteLoader>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectActiveUserInfo(state),
    dealRecords: selectDealList(state)
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchDealRecords
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(WalletDetail)