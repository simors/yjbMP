/**
 * Created by wanpeng on 2017/8/18.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
var pingpp = require('pingpp-js')
import {createPayment} from '../../actions/authActions'
import * as appConfig from '../../constants/appConfig'
import {selectActiveUserInfo} from '../../selector/authSelector'
import {fetchPromotionAction} from '../../actions/promotionActions'
import {selectCategoryByTitle, selectPromByCategoryId} from '../../selector/promotionSelector'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './recharge.css'

const {
  Button,
  Page,
} = WeUI

class Recharge extends Component {
  constructor(props) {
    super(props)
    this.defaultRechargeList = [
      {recharge: 10, award: 0},
      {recharge: 20, award: 0},
      {recharge: 50, award: 0},
      {recharge: 100, award: 0},
    ]   //默认充值金额列表
    this.state = {
      selectAmount: this.defaultRechargeList[0].recharge,
      selectAward: this.defaultRechargeList[0].award,
      disableButton: false,
    }
  }

  componentWillMount() {
    const {fetchPromotionAction} = this.props
    fetchPromotionAction({})
  }

  componentWillReceiveProps(newProps) {
    const {promotion} = newProps
    if(promotion) {
      this.setState({
        selectAmount: promotion.awards.rechargeList[0].recharge,
        selectAward: promotion.awards.rechargeList[0].award,
      })
    }
  }

  componentDidMount() {
    document.title = "充值"
  }

  changeAmount(amount, award) {
    this.setState({
      selectAmount: amount,
      selectAward: award,
    })
  }

  getTripText() {
    const {promotion} = this.props
    let tripText = ""
    if(promotion) {
      promotion.awards.rechargeList.forEach((value) => {
        if(value.recharge === this.state.selectAmount) {
          tripText = "您选择了“充"+ value.recharge +"元得"+ value.award +"元”"
        }
      })
    } else {
      this.defaultRechargeList.forEach((value) => {
        if(value.recharge === this.state.selectAmount) {
          tripText = "您选择了“充值"+ value.recharge +"元”"
        }
      })
    }
    return tripText
  }

  getTripDesc() {
    const {promotion} = this.props
    let tripText = ""
    if(promotion) {
      promotion.awards.rechargeList.forEach((value) => {
        if(value.recharge === this.state.selectAmount) {
          tripText = "本次充值后，账户会增加" + (Number(value.recharge) + Number(value.award)) + "元，其中" + value.award + "元赠款不可退。"
        }
      })
    } else {
      this.defaultRechargeList.forEach((value) => {
        if(value.recharge === this.state.selectAmount) {
          tripText = "本次充值后，账户会增加" + (Number(value.recharge) + Number(value.award)) + "元。"
        }
      })
    }
    return tripText
  }

  createPaymentSuccessCallback = (charge) => {
    var that = this
    pingpp.createPayment(charge, function (result, err) {
      that.setState({disableButton: false})
      if (result == "success") {
        // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
        browserHistory.push('/mine/wallet')
      } else if (result == "fail") {
        // charge 不正确或者微信公众账号支付失败时会在此处返回
      } else if (result == "cancel") {
        // 微信公众账号支付取消支付
      }
    })
  }

  createPaymentFailedCallback = (error) => {
    this.setState({disableButton: false})
    console.log('onRecharge', error)
  }

  onRecharge = () => {
    const {currentUser, promotion, createPayment} = this.props
    this.setState({disableButton: true})
    createPayment({
      amount: __DEV__ || __STAGE__? this.state.selectAmount * 0.01 : this.state.selectAmount,
      channel: 'wx_pub',
      metadata: {
        'fromUser': currentUser.id,
        'toUser': 'platform',
        'dealType': appConfig.RECHARGE,
        'promotionId': promotion? promotion.id: undefined,
        'award': this.state.selectAward,
      },
      openid: currentUser.authData.weixin.openid,
      subject: '衣家宝充值',
      success: this.createPaymentSuccessCallback,
      error: this.createPaymentFailedCallback,
    })
  }

  renderRechargeButton() {
    const {promotion} = this.props
    const rechargeList = promotion? promotion.awards.rechargeList : this.defaultRechargeList
    return (
      <div>
        {
          rechargeList.map((value, index) => (
            <Button key={index} className='amountButton'
                    plain={this.state.selectAmount != value.recharge}
                    style={this.state.selectAmount == value.recharge? {color: `#fff`}: {}}
                    onClick={() => this.changeAmount(value.recharge, value.award)} >
              {'充' + value.recharge + '元' + (value.award? ('得' + value.award + '元') : '')}
            </Button>
          ))
        }
      </div>
    )
  }

  render() {
    return(
      <Page ptr={false}>
        <div className="banner">
        </div>
        <div className="button-area">
          {this.renderRechargeButton()}
        </div>
        <div className="trip">
          <text className="tripTitle">{this.getTripText()}</text>
          <text className="tripDesc">{this.getTripDesc()}</text>
        </div>
        <div className="rechargeButton">
          <Button disabled={this.state.disableButton} onClick={this.onRecharge}>
            {"充值" + this.state.selectAmount + '元'}
          </Button>
        </div>
      </Page>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let rechargeCategory = selectCategoryByTitle(state, '充值奖励')
  let promotion = undefined
  if(rechargeCategory) {
    promotion = selectPromByCategoryId(state, rechargeCategory.id)
  }
  return {
    promotion: promotion,
    currentUser: selectActiveUserInfo(state)
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createPayment,
  fetchPromotionAction,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Recharge)