/**
 * Created by wanpeng on 2017/8/29.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
var pingpp = require('pingpp-js')
import {createPayment} from '../../actions/authActions'
import {selectActiveUserInfo} from '../../selector/authSelector'
import {selectCurrentStation} from '../../selector/stationSelector'
import * as appConfig from '../../constants/appConfig'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './deposit.css'

const { Button } = WeUI

import {Toast, ActivityIndicator} from 'antd-mobile'

class Deposit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      disableButton: false,
    }
  }

  createPaymentSuccessCallback = (charge) => {
    var that = this
    pingpp.createPayment(charge, function (result, err) {
      that.setState({disableButton: false})
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
    this.setState({disableButton: false})
    Toast.fail("支付渠道错误")
  }

  payDeposit = () => {
    const {currentStation, currentUser} = this.props
    this.props.createPayment({
      amount: currentStation.deposit,
      channel: 'wx_pub',
      metadata: {
        'fromUser': currentUser.id,
        'toUser': 'platform',
        'dealType': appConfig.DEPOSIT
      },
      openid: currentUser.authData.weixin.openid,
      subject: '衣家宝押金支付',
      success: this.createPaymentSuccessCallback,
      error: this.createPaymentFailedCallback,
    })
  }

  render() {
    const {currentStation, currentUser} = this.props
    if(currentStation) {
      return(
        <div>
          <div className="deposit-banner">
            <img src="/logo.png" alt="" style={{display: `block`, width: `7.5rem`, height: `6.75rem`}}/>
          </div>
          <div>
            <div className="deposit-amount-trip">请支付押金</div>
            <div className="deposit-amount">{currentStation.deposit + '元'}</div>
          </div>
          <div className="deposit-button-area" >
            <div className="deposit-button-trip">押金可在“个人中心－钱包”中申请退还</div>
            <Button className='deposit-button' disabled={this.state.disableButton} onClick={this.payDeposit}>微信钱包支付</Button>
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
    currentStation: selectCurrentStation(state),
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createPayment,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Deposit)