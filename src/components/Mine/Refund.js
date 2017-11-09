/**
 * Created by wanpeng on 2017/8/31.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import {selectActiveUserInfo, selectWalletInfo} from '../../selector/authSelector'
import {requestRefund} from '../../actions/authActions'
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
    this.state = {
      disableButton: false,
    }
  }

  componentDidMount() {
    document.title = "退押金"
  }

  onRefundError = (error) => {
    this.setState({disableButton: true})
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
        break
      case errno.ERROR_UNPAID_ORDER:
        Toast.fail("有未支付订单", 2)
        break
      case errno.ERROR_OCCUPIED_ORDER:
        Toast.fail("有正在使用中订单", 2)
        break
      default:
        Toast.fail("内部错误：" + error.code, 2)
        break
    }
  }

  refundDeposit = () => {
    const {requestRefund, walletInfo} = this.props
    requestRefund({
      amount: walletInfo.deposit,
      success: () => {
        this.setState({disableButton: false})
        Toast.success('押金退款申请成功')
        browserHistory.goBack()
      },
      error: this.onRefundError
    })
  }

  render() {
    const {walletInfo, currentUser} = this.props
    if(walletInfo) {
      return(
        <div style={{backgroundColor: `#EFEFF4`}}>
          <div className="primary-area">
            <div>{'退款金额：' + Number(walletInfo.deposit).toFixed(2) + '元'}</div>
            <div>{'退款账户：' + currentUser.nickname + '的微信钱包账户'}</div>
          </div>
          <div className="refund-trip">退款将在7个工作日内到账，请您注意微信支付的通知并查看微信钱包余额变动。</div>
          <div className="button-area">
            <Button onClick={this.refundDeposit} disabled={this.state.disableButton}>确认退回</Button>
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
  requestRefund
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Refund)