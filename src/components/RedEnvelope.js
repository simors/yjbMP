/**
 * Created by wanpeng on 2017/10/23.
 */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
const {Button, Dialog, LoadMore} = WeUI
import io from 'socket.io-client'
import * as appConfig from '../constants/appConfig'
import {selectActiveUserId} from '../selector/authSelector'
import {selectPromByCategoryType} from '../selector/promotionSelector'
import {fetchPromotionAction, fetchPromCategoryAction} from '../actions/promotionActions'

const socket = io(appConfig.LC_SERVER_DOMAIN)


class RedEnvelope extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      showDialog: false,
      Dialog: {
        title: '恭喜获得红包：',
        trip: '奖金详情请通过衣家宝公众号钱包查看',
        buttons: [
          {
            type: 'default',
            label: '返回',
            onClick: () => {this.setState({showDialog: false})}
          }
        ]
      },
    }
  }

  componentWillMount() {
    const {fetchPromotionAction, fetchPromCategoryAction} = this.props
    fetchPromCategoryAction({})
    fetchPromotionAction({})
  }


  sendRedEnvelopeRequest = () => {
    var that = this
    const {promotion, currentUserId} = this.props
    that.setState({
      loading: true
    })
    //发送红包请求
    socket.emit(appConfig.PROMOTION_REQUEST, {
      promotionId: promotion.id,
      userId: currentUserId,
    }, function (data) {
      console.log("红包请求ack消息：", data)
    })

    //监听红包响应
    socket.on(appConfig.PROMOTION_RESPONSE, function (data) {
      that.setState({
        loading: false
      })
      let errorCode = data.errorCode
      let amount = data.amount
      if(errorCode === 0) {
        that.setState({
          showDialog: true,
          Dialog: {
            title: '恭喜获得红包：' + amount + "元",
            trip: '奖金详情请关注衣家宝公众号钱包查看',
            buttons: [
              {
                type: 'default',
                label: '返回',
                onClick: () => {that.setState({showDialog: false})}
              }
            ]
          },
        })
      } else {
        that.setState({
          showDialog: true,
          Dialog: {
            title: '失败',
            trip: '错误代码：' + errorCode,
            buttons: [
              {
                type: 'default',
                label: '返回',
                onClick: () => {that.setState({showDialog: false})}
              }
            ]
          },
        })
      }
    })
  }

  getButtonTrip() {
    const {promotion} = this.props
    if(!promotion) {
      return "暂时没有红包活动"
    } else if(this.state.loading) {
      return (<LoadMore loading/>)
    } else {
      return "领取红包"
    }
  }

  render() {
    const {promotion} = this.props
    return (
      <div>
        <Button disabled={!promotion} onClick={this.sendRedEnvelopeRequest}>{this.getButtonTrip()}</Button>
        <Dialog type="ios"
                title={this.state.Dialog.title}
                buttons={this.state.Dialog.buttons}
                show={this.state.showDialog}>
          {this.state.Dialog.trip}
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    promotion: selectPromByCategoryType(state, appConfig.PROMOTION_CATEGORY_TYPE_REDENVELOPE),
    currentUserId: selectActiveUserId(state)
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchPromotionAction,
  fetchPromCategoryAction
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(RedEnvelope)