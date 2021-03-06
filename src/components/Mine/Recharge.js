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
import {selectActiveUserInfo, selectActiveUserId} from '../../selector/authSelector'
import {fetchPromotionAction} from '../../actions/promotionActions'
import {selectCategoryByTitle, selectPromByCategoryId} from '../../selector/promotionSelector'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './recharge.css'
import {Toast, ActivityIndicator} from 'antd-mobile'
import * as errno from '../../errno'

const {
  Button,
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
      loading: true,
    }
  }

  componentWillMount() {
    const {fetchPromotionAction, currentUserId} = this.props
    if(currentUserId) {
      fetchPromotionAction({
        success: () => {this.setState({loading: false})},
        error: (error) => {this.setState({loading: false})},
      })
    }
  }

  componentWillReceiveProps(newProps) {
    const {promotion, currentUserId} = newProps
    if(promotion && this.props.promotion === undefined) {
      this.setState({
        selectAmount: promotion.awards.rechargeList[0].recharge,
        selectAward: promotion.awards.rechargeList[0].award,
      })
    }
    if(currentUserId && currentUserId != this.props.currentUserId) {
      fetchPromotionAction({})
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
          tripText = "您选择了“充"+ value.recharge +"元送"+ value.award +"元”"
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
          tripText = "本次充值后，账户会增加" + (Number(value.recharge) + Number(value.award)) + "元。"
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
        Toast.success("支付成功", 1)
        browserHistory.goBack()
      } else if (result == "fail") {
        Toast.fail("支付失败", 2)
      } else if (result == "cancel") {
        Toast.info("取消支付", 1)
      }
    })
  }

  createPaymentFailedCallback = (error) => {
    this.setState({disableButton: false})
    switch (error.code) {
      case errno.ERROR_PROM_INVALID:
        Toast.fail("充值活动已经失效")
        break
      case errno.ERROR_CREATE_CHARGES:
        Toast.fail("创建充值请求失败")
        break
      default:
        Toast.fail("创建充值请求失败：" + error.code)
        break
    }
  }

  onRecharge = () => {
    const {currentUser, promotion, createPayment} = this.props
    this.setState({disableButton: true})
    createPayment({
      amount: this.state.selectAmount,
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
      <div className="rechargeButtonArea">
        {
          rechargeList.map((value, index) => (
            <div key={index} className="buttonWarp">
              <Button key={index} className='amountButton'
                      plain={this.state.selectAmount != value.recharge}
                      style={this.state.selectAmount == value.recharge? {color: `#fff`}: {}}
                      onClick={() => this.changeAmount(value.recharge, value.award)} >
                {'充' + value.recharge + '元' + (value.award? ('送' + value.award + '元') : '')}
              </Button>
            </div>
          ))
        }
      </div>
    )
  }

  render() {
    const {loading} = this.state
    const {currentUserId} = this.props
    if(!currentUserId || loading) {
      return(<ActivityIndicator toast text="正在加载" />)
    }
    return(
      <div className="rechargePage">
        <div>
          <div className="rechargeBanner">
          </div>
          {this.renderRechargeButton()}
        </div>
        <div>
          <div className="trip">
            <text className="tripTitle">{this.getTripText()}</text>
            <text className="tripDesc">{this.getTripDesc()}</text>
          </div>
          <div className="rechargeButton">
            <Button disabled={this.state.disableButton} onClick={this.onRecharge}>
              {"充值" + this.state.selectAmount + '元'}
            </Button>
          </div>
        </div>
      </div>
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
    currentUser: selectActiveUserInfo(state),
    currentUserId: selectActiveUserId(state)
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createPayment,
  fetchPromotionAction,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Recharge)