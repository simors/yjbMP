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
import {Button, Modal, Toast } from 'antd-mobile'
import './redEnvelope.css'
import * as errno from '../../errno'

const socket = io(appConfig.LC_SERVER_DOMAIN)

class RedEnvelope extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      visible: true,
      amount: undefined,
      loading: false,
    }
  }

  componentWillMount() {
    const {fetchPromotionAction, fetchPromCategoryAction} = this.props
    fetchPromCategoryAction({})
    fetchPromotionAction({})
  }

  componentDidMount() {
    const {promotion} = this.props
    if(promotion) {
      this.setState({visible: true})
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
      if(errorCode === 0) {
        that.setState({amount: amount, loading: false})
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
    if(!amount) {
      return(<Button loading={loading}
                     className="redEnvelope-button"
                     onClick={this.sendRedEnvelopeRequest}>
        领取红包
      </Button>)
    } else if(amount > 0) {
      return(
        <div className="redEnvelope">
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
    const {promotion} = this.props
    return(
      <Modal visible={visible && !!promotion} transparent={true} popup={true}>
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