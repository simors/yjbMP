/**
 * Created by wanpeng on 2017/10/23.
 */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
// const {Button, Dialog, LoadMore} = WeUI
import io from 'socket.io-client'
import * as appConfig from '../../constants/appConfig'
import {selectActiveUserId} from '../../selector/authSelector'
import {selectPromByCategoryType} from '../../selector/promotionSelector'
import {fetchPromotionAction, fetchPromCategoryAction} from '../../actions/promotionActions'
import {Modal, Toast, ActivityIndicator} from 'antd-mobile'
import './redEnvelope.css'
import * as errno from '../../errno'

const socket = io(appConfig.LC_SERVER_DOMAIN)

class RedEnvelope extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: true,
      amount: undefined,
      loading: true,
    }
  }

  componentWillMount() {
    const {fetchPromotionAction, fetchPromCategoryAction, currentUserId} = this.props
    if(currentUserId) {
      fetchPromCategoryAction({})
      fetchPromotionAction({})
    }
  }

  componentWillReceiveProps(newProps) {
    const {currentUserId} = newProps
    if(currentUserId && currentUserId != this.props.currentUserId) {
      fetchPromCategoryAction({})
      fetchPromotionAction({})
    }
  }


  sendRedEnvelopeRequest = () => {
    var that = this
    const {promotion, currentUserId} = this.props
    //发送红包请求
    this.setState({loading: true})
    socket.emit(appConfig.PROMOTION_REQUEST, {
      promotionId: promotion.id,
      userId: currentUserId,
    })

    //监听红包响应
    socket.on(appConfig.PROMOTION_RESPONSE, function (data) {
      let errorCode = data.errorCode
      let amount = data.amount
      that.setState({amount: amount, loading: false})
      if(errorCode === 0) {
      } else {
        switch (errorCode) {
          case errno.EINVAL:
            Toast.fail("参数错误", 2)
            break
          case errno.ENODATA:
            Toast.fail("没有找到活动对象", 2)
            break
          case errno.ERROR_PROM_DISABLED:
            Toast.fail("活动处于禁用状态", 2)
            break
          case errno.ERROR_PROM_TIME:
            Toast.fail("没在活动时间内", 2)
            break
          case errno.ERROR_PROM_REGION:
            Toast.fail("没在活动范围", 2)
            break
          case errno.ERROR_PROM_INVALID:
            Toast.fail("活动已失效", 2)
            break
          case errno.ERROT_PROM_LIMIT:
            Toast.fail("用户参数次数限制", 2)
            break
          default:
            Toast.fail("内部错误：" + errorCode, 2)
            break
        }
      }
    })
  }

  renderOverlay() {
    const {amount, loading} = this.state
    if(loading) {
      return(<ActivityIndicator toast text="正在加载" />)
    }
    if(!amount) {
      return(
        <div className="redEnvelope" onClick={this.sendRedEnvelopeRequest}>
        </div>
      )
    } else if(amount > 0) {
      return(
        <div className="redEnvelopeOpen">
          <div className="redEnvelopeAmount">{amount + "元运气红包"}</div>
          <div className="closeButton" onClick={() => this.setState({visible: false})}></div>
        </div>
      )
    } else if(amount === 0) {
      return(
        <div className="redEnvelope">
          <div className="redEnvelopeAmount">没有抢到红包</div>
          <div className="closeButton" onClick={() => this.setState({visible: false})}></div>
        </div>
      )
    }
  }

  render() {
    const {visible} = this.state
    const {promotion, currentUserId} = this.props
    if(!currentUserId) {
      return(null)
    }
    return(
      <Modal visible={visible && !!promotion} transparent={true} popup={true} onClose={() => this.setState({visible: false})}>
        {this.renderOverlay()}
      </Modal>
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