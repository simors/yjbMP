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
import {selectUserInfo} from '../../selector/authSelector'
import { createPayment, createTransfer} from '../../actions/authActions'
import * as appConfig from '../../constants/appConfig'

const {
  Button,
  Panel,
  Page,
  PanelHeader,
  PanelBody,
  MediaBox,
  MediaBoxTitle,
  MediaBoxDescription,
} = WeUI

class Wallet extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    document.title = "钱包"
  }

  onPress = () => {
    if(this.props.currentUser.deposit === 0) {  //交押金
      this.payDeposit()
    } else {  //退押金
      this.refundDeposit()
    }
  }

  createPaymentSuccessCallback = (charge) => {
    pingpp.createPayment(charge, function (result, err) {
      if (result == "success") {
        // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
      } else if (result == "fail") {
        // charge 不正确或者微信公众账号支付失败时会在此处返回
      } else if (result == "cancel") {
        // 微信公众账号支付取消支付
      }
    })
  }

  createPaymentFailedCallback = (error) => {
    console.log('onDeposit', error)
  }

  payDeposit() {
    this.props.createPayment({
      amount: 1,  //TODO 可配置，从leancloud获取
      channel: 'wx_pub',
      metadata: {
        'fromUser': this.props.currentUser.id,
        'toUser': 'platform',
        'dealType': appConfig.DEPOSIT
      },
      // openid: this.props.currentUser.authData.weixin.openid,
      openid: "osChqwZcLGd9j6RSYTw1t1YRDiDc", //测试
      subject: '衣家宝押金支付',
      success: this.createPaymentSuccessCallback,
      error: this.createPaymentFailedCallback,
    })
  }

  refundDeposit() {
    browserHistory.push('/mine/refund')
  }

  render() {
    return(
      <Page ptr={false}>
        <div className="walletcontainer">
          <text className="amount">{this.props.currentUser.balance + '元'}</text>
          <text className="amountTrip">当前余额</text>

          <div className="buttons-area">
            <Button type='primary' plain className="detailsButton" onClick={() => {browserHistory.push('/mine/wallet/walletDetail')}}>明细</Button>
            <Button type='primary' plain className="rechargeButton" onClick={() => {browserHistory.push('/mine/wallet/recharge')}}>充值</Button>
          </div>
        </div>
        <div className="deposit">
          <text className="depositTrip">{'押金：' + this.props.currentUser.deposit + '元'}</text>
          <div className="depositButton-area">
            <Button type='primary' plain className="depositButton" onClick={this.onPress}>{this.props.currentUser.deposit === 0? '交押金' : '退押金'}</Button>
          </div>
        </div>
      </Page>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectUserInfo(state)
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createPayment,
  createTransfer,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)