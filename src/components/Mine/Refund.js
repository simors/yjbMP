/**
 * Created by wanpeng on 2017/8/31.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import {selectUserInfo, selectWalletInfo} from '../../selector/authSelector'
import {createTransfer} from '../../actions/authActions'
import * as appConfig from '../../constants/appConfig'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './refund.css'

const {
  Button,
  Page,
} = WeUI

class Refund extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    document.title = "退押金"
  }

  refundDeposit = () => {
    this.props.createTransfer({
      amount: this.props.walletInfo.deposit,
      channel: 'wx_pub',
      metadata: {
        'fromUser': 'platform',
        'toUser': this.props.currentUser.id,
        'dealType': appConfig.REFUND
      },
      openid: this.props.currentUser.authData.weixin.openid,
      username: '',
      success: () => {browserHistory.push('/mine/wallet')},
      error: (error) => {console.log("退押金失败", error)}
    })
  }

  render() {
    return(
      <Page style={{backgroundColor: `#EFEFF4`}}>
        <div className="primary-area">
          <div>{'退款金额：' + this.props.walletInfo.deposit + '元'}</div>
          <div>{'退款账户：' + this.props.currentUser.nickname + '的微信钱包账户'}</div>
        </div>
        <div className="refund-trip">退款实时到账，请您注意微信支付的通知并查看微信钱包余额变动。</div>
        <div className="button-area">
          <Button onClick={this.refundDeposit}>确认退回</Button>
        </div>
      </Page>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectUserInfo(state),
    walletInfo: selectWalletInfo(state),
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createTransfer
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Refund)