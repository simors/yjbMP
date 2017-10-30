/**
 * Created by wanpeng on 2017/8/31.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import {selectActiveUserInfo, selectWalletInfo} from '../../selector/authSelector'
import {createTransfer} from '../../actions/authActions'
import * as appConfig from '../../constants/appConfig'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './refund.css'
import {Toast, ActivityIndicator} from 'antd-mobile'
import * as errno from '../../errno'

const {
  Button,
} = WeUI

class Refund extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    document.title = "退押金"
  }

  onRefundError = (error) => {
    switch (error.code) {
      case errno.ERROR_UNSUPPORT_CHANNEL:
        Toast.fail("支付渠道错误", 2)
        break
      case errno.ERROR_IN_REFUND_PROCESS:
        Toast.fail("退款处理中", 2)
        break
      case errno.ERROR_NOT_MATCH_DEPOSIT:
        Toast.fail("押金有误", 2)
        break
      case errno.ERROR_CREATE_TRANSFER:
        Toast.fail("创建交易请求失败", 2)
      default:
        Toast.fail("内部错误：" + error.code, 2)
        break
    }
  }

  refundDeposit = () => {
    const {createTransfer, walletInfo, currentUser} = this.props
    createTransfer({
      amount: walletInfo.deposit,
      channel: 'wx_pub',
      metadata: {
        'fromUser': 'platform',
        'toUser': currentUser.id,
        'dealType': appConfig.REFUND
      },
      openid: currentUser.authData.weixin.openid,
      username: '',
      success: () => {browserHistory.push('/mine/wallet')},
      error: this.onRefundError
    })
  }

  render() {
    const {walletInfo, currentUser} = this.props
    if(walletInfo) {
      return(
        <div style={{backgroundColor: `#EFEFF4`}}>
          <div className="primary-area">
            <div>{'退款金额：' + walletInfo.deposit + '元'}</div>
            <div>{'退款账户：' + currentUser.nickname + '的微信钱包账户'}</div>
          </div>
          <div className="refund-trip">退款实时到账，请您注意微信支付的通知并查看微信钱包余额变动。</div>
          <div className="button-area">
            <Button onClick={this.refundDeposit}>确认退回</Button>
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
    walletInfo: selectWalletInfo(state),
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createTransfer
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Refund)