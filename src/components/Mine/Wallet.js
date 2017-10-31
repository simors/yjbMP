/**
 * Created by wanpeng on 2017/8/16.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
var pingpp = require('pingpp-js')
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './wallet.css'
import {selectActiveUserInfo, selectWalletInfo, selectActiveUserId} from '../../selector/authSelector'
import { createPayment, createTransfer, fetchWalletInfo} from '../../actions/authActions'
import * as appConfig from '../../constants/appConfig'
import {ActivityIndicator, Toast} from 'antd-mobile'

const {Button, Page} = WeUI

class Wallet extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {currentUserId} = this.props
    if(currentUserId) {
      this.props.fetchWalletInfo({})
    }
  }

  componentDidMount() {
    document.title = "钱包"
  }

  componentWillReceiveProps(newProps) {
    const {currentUserId} = newProps
    if(currentUserId && currentUserId != this.props.currentUserId) {
      this.props.fetchWalletInfo({})
    }
  }

  onPress = () => {
    const {walletInfo} = this.props
    if(walletInfo.process === appConfig.WALLET_PROCESS_TYPE_REFUND) {
      return
    } else if(walletInfo.deposit === 0) {  //交押金
      browserHistory.push('/mine/deposit')
    } else {  //退押金
      this.refundDeposit()
    }
  }

  createPaymentSuccessCallback = (charge) => {
    pingpp.createPayment(charge, function (result, err) {
      if (result == "success") {
        Toast.success("支付成功", 1)
      } else if (result == "fail") {
        Toast.fail("支付失败", 2)
      } else if (result == "cancel") {
        Toast.info("取消支付", 1)
      }
    })
  }

  createPaymentFailedCallback = (error) => {
    console.log('onDeposit', error)
    Toast.fail("支付渠道错误")
  }

  refundDeposit() {
    browserHistory.push('/mine/refund')
  }

  renderDeposit = () => {
    const {walletInfo} = this.props
    if(walletInfo.deposit > 0) {
      return(
        <div className="deposit">
          <text className="depositTrip">{'押金：' + (walletInfo.deposit || 0) + '元'}</text>
          <div className="depositButton-area">
            <Button type='primary' plain className="depositButton" onClick={this.onPress}>
              {walletInfo.process === appConfig.WALLET_PROCESS_TYPE_REFUND? '押金退款处理中' : '退押金'}
              </Button>
          </div>
        </div>
      )
    } else {
      return(
        <div className="deposit">
          <text className="depositTrip">{'押金：' + 0 + '元'}</text>
        </div>
      )
    }
  }

  render() {
    const {walletInfo, currentUserId} = this.props
    if(!currentUserId || !walletInfo) {
      return(<ActivityIndicator toast text="正在加载" />)
    }
    return(
      <div>
        <div className="walletcontainer">
          <text className="amount">{(walletInfo.balance || 0) + '元'}</text>
          <text className="amountTrip">当前余额</text>

          <div className="buttons-area">
            <Button type='primary' plain className="detailsButton" onClick={() => {browserHistory.push('/mine/wallet/walletDetail')}}>明细</Button>
            <Button type='primary' plain className="rechargeButton" onClick={() => {browserHistory.push('/mine/wallet/recharge')}}>充值</Button>
          </div>
        </div>
        {this.renderDeposit()}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUserId: selectActiveUserId(state),
    currentUser: selectActiveUserInfo(state),
    walletInfo: selectWalletInfo(state)
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createPayment,
  createTransfer,
  fetchWalletInfo,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)