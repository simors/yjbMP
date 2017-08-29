/**
 * Created by wanpeng on 2017/8/29.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
var pingpp = require('pingpp-js')
import {createPayment} from '../../actions/authActions'
import {selectUserInfo} from '../../selector/authSelector'
import * as appConfig from '../../constants/appConfig'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './deposit.css'

const {
  Button,
  Panel,
  Page,
  PanelHeader,
  PanelBody,
  MediaBox,
  MediaBoxTitle,
  MediaBoxDescription,
  Msg,
  LoadMore,
} = WeUI

class Deposit extends Component {
  constructor(props) {
    super(props)
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

  payDeposit = () => {
    this.props.createPayment({
      amount: 1,
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

  render() {
    return(
      <Page ptr={false} infiniteLoader={false}>
        <div className="deposit-banner">
          <img src="/logo.png" alt="" style={{display: `block`, width: `7.5rem`, height: `6.75rem`}}/>
        </div>
        <div>
          <div className="deposit-amount-trip">请支付押金</div>
          <div className="deposit-amount">229元</div>
        </div>
        <div className="deposit-button-area" >
          <div className="deposit-button-trip">押金可在“个人中心－钱包”中申请退还</div>
          <Button className='deposit-button' onClick={this.payDeposit}>微信钱包支付</Button>
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
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Deposit)