/**
 * Created by wanpeng on 2017/10/29.
 */
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {NoticeBar} from 'antd-mobile'
import {fetchPromotionAction, fetchPromCategoryAction} from '../../actions/promotionActions'
import {selectActiveUserId} from '../../selector/authSelector'
import {selectPromByCategoryType} from '../../selector/promotionSelector'
import * as appConfig from '../../constants/appConfig'


class ScoreExchange extends React.PureComponent {
  constructor(props) {
    super(props)
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

  render() {
    const {promotion, currentUserId} = this.props
    if(!currentUserId || !promotion) {
      return(null)
    }
    return(
      <NoticeBar mode="link"
                 onClick={() => {
                   document.location = appConfig.PROMOTION_EXCHANGE_SCORE_URL + '/' + currentUserId
                 }}>
        积分兑换活动
      </NoticeBar>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    promotion: selectPromByCategoryType(state, appConfig.PROMOTION_CATEGORY_TYPE_EXCHANGE_SCORE),
    currentUserId: selectActiveUserId(state)
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchPromotionAction,
  fetchPromCategoryAction
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ScoreExchange)