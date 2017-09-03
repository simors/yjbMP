/**
 * Created by wanpeng on 2017/8/18.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import WeUI from 'react-weui'
import {fetchDealRecords} from '../../actions/authActions'
import {selectUserInfo, selectDealRecord} from '../../selector/authSelector'
import {DEPOSIT, RECHARGE, SERVICE, REFUND, WITHDRAW} from '../../constants/appConfig'
  import {formatTime} from  '../../util'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './wallet-detail.css'

const {
  Button,
  Panel,
  Page,
  PanelHeader,
  PanelBody,
  MediaBox,
  MediaBoxTitle,
  MediaBoxDescription,
  InfiniteLoader,
  Cells,
  Cell,
  CellBody,
  CellFooter,
  CellsTitle,
} = WeUI

class WalletDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [...Array(20).keys()],
      records: [{title: '付款成功－充值', date: '2017-03-30 14:23', amount: 50, type: '平台充值'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
      ]
    }
  }

  componentWillMount() {
    this.props.fetchDealRecords({
      userId: this.props.currentUser.id
    })
  }

  componentDidMount() {
    document.title = "消费明细"
  }

  onLoadMoreRecord = (resolve, finish) => {
    console.log("获取更多消费记录！")
    setTimeout(function () {
      resolve()
    }, 1000)
  }

  showRecordDetail(record) {

  }

  getDealTitle(record) {
    switch (record.dealType) {
      case DEPOSIT:
        return "付款成功-押金"
        break
      case RECHARGE:
        return "付款成功-充值"
        break
      case SERVICE:
        return "付款成功-干衣"
        break
      case REFUND:
        return "退款成功-押金"
        break
      case WITHDRAW:
        return "提现成功-余额"
        break
      default:
        break
    }
  }

  getDealType(record) {
    switch (record.dealType) {
      case DEPOSIT:
        return "押金"
        break
      case RECHARGE:
        return "平台充值"
        break
      case SERVICE:
        return "干衣消费"
        break
      case REFUND:
        return "押金退款"
        break
      case WITHDRAW:
        return "余额提现"
        break
      default:
        break
    }
  }

  render(){
    return (
    <InfiniteLoader onLoadMore={this.onLoadMoreRecord}>
      <Page ptr={false}>
        <Cells>
          {
            this.props.dealRecords.map( (item, i) => {
              return (
                <Cell key={i} access onClick={() => {this.showRecordDetail(item)}}>
                  <CellBody>
                    <div className="record">
                      <div className="record-header">
                        <text className="content-primary">{this.getDealTitle(item)}</text>
                        <text className="content-trip">{formatTime((new Date(item.dealTime)).getTime(),'YYYY-MM-DD HH:mm')}</text>
                      </div>
                      <div className="record-content">
                        <text className="content-primary">{item.cost + '元'}</text>
                        <text className="content-trip">{this.getDealType(item)}</text>
                      </div>
                    </div>
                  </CellBody>
                </Cell>
              )
            })
          }
        </Cells>
      </Page>
    </InfiniteLoader>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectUserInfo(state),
    dealRecords: selectDealRecord(state)
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchDealRecords
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(WalletDetail)