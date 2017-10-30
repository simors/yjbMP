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
import {selectActiveUserInfo, selectWalletInfo} from '../../selector/authSelector'
import { createPayment, createTransfer, fetchWalletInfo} from '../../actions/authActions'
import {fetchPromCategoryAction} from '../../actions/promotionActions'
import * as appConfig from '../../constants/appConfig'
import {ActivityIndicator, Toast} from 'antd-mobile'

const {Button, Page} = WeUI

class Wallet extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.fetchPromCategoryAction({})
    this.props.fetchWalletInfo({})
  }

  componentDidMount() {
    document.title = "钱包"
  }

  onPress = () => {
    if(this.props.walletInfo.deposit === 0) {  //交押金
      this.payDeposit()
    } else {  //退押金
      this.refundDeposit()
    }
  }

  createPaymentSuccessCallback = (charge) => {
    pingpp.createPayment(charge, function (result, err) {
      if (result == "success") {
        // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
        Toast.success("支付成功", 1)
      } else if (result == "fail") {
        // charge 不正确或者微信公众账号支付失败时会在此处返回
        Toast.fail("支付失败", 2)
      } else if (result == "cancel") {
        // 微信公众账号支付取消支付
        Toast.info("取消支付", 1)
      }
    })
  }

  createPaymentFailedCallback = (error) => {
    console.log('onDeposit', error)
    Toast.fail("支付渠道错误")
  }

  payDeposit() {
    this.props.createPayment({
      amount: __DEV__ || __STAGE__? 100 * 0.01 : 100, //TODO 押金从服务点读取
      channel: 'wx_pub',
      metadata: {
        'fromUser': this.props.currentUser.id,
        'toUser': 'platform',
        'dealType': appConfig.DEPOSIT
      },
      openid: this.props.currentUser.authData.weixin.openid,
      subject: '衣家宝押金支付',
      success: this.createPaymentSuccessCallback,
      error: this.createPaymentFailedCallback,
    })
  }

  refundDeposit() {
    browserHistory.push('/mine/refund')
  }

  render() {
    const {walletInfo} = this.props
    if(walletInfo) {
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
          <div className="deposit">
            <text className="depositTrip">{'押金：' + (walletInfo.deposit || 0) + '元'}</text>
            <div className="depositButton-area">
              <Button type='primary' plain className="depositButton" onClick={this.onPress}>{walletInfo.deposit === 0? '交押金' : '退押金'}</Button>
            </div>
          </div>
        </div>
      )
    } else {
      return(<ActivityIndicator toast text="正在加载" />)
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectActiveUserInfo(state),
    walletInfo: selectWalletInfo(state)
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createPayment,
  createTransfer,
  fetchWalletInfo,
  fetchPromCategoryAction
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)