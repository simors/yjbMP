/**
 * Created by wanpeng on 2017/8/16.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import WeUI from 'react-weui'
import './wallet.css'

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

  render() {
    return(
      <Page ptr={false}>
        <div className="walletcontainer">
          <text className="amount">{43.30 + '元'}</text>
          <text className="amountTrip">当前余额</text>

          <div className="buttons-area">
            <Button type='primary' plain className="detailsButton">明细</Button>
            <Button type='primary' plain className="rechargeButton" onClick={() => {browserHistory.replace('/mine/wallet/recharge')}}>充值</Button>
          </div>
        </div>
        <div className="deposit">
          <text className="depositTrip">押金：299元</text>
          <div className="depositButton-area">
            <Button type='primary' plain className="depositButton" onClick={() => {browserHistory.goBack()}}>退押金</Button>
          </div>
        </div>
      </Page>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {

  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)