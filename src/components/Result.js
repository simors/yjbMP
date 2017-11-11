/**
 * Created by wanpeng on 2017/11/7.
 */
import React, {PureComponent} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import {selectActiveUserInfo, selectToken} from '../selector/authSelector'
import {autoLogin} from '../actions/authActions'

const {Msg} = WeUI

class Result extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {autoLogin, token} = this.props
    if(token) {
      autoLogin({token: token})
    }
  }

  componentDidMount() {
    const {title} = this.props.params
    document.title = title || "衣家宝"
  }

  onPress = () => {
    const {subscribe, title} = this.props
    if(!subscribe) {
      browserHistory.push('/focus')
      return
    }
    switch (title) {
      case '订单支付成功':
        browserHistory.goBack()
        break
      case '手机绑定成功':
      case '开机成功':
      default:
        browserHistory.replace('/mine')
    }
  }

  render() {
    console.log("props", this.props)
    const {subscribe, params} = this.props
    const {title, type} = params
    return (
      <Msg
        type={type}
        title={title}
        buttons={[{
          type: 'primary',
          label: subscribe? '确定': '关注衣家宝公众号',
          onClick: this.onPress
        }]}
        footer={() =>(<img style={{width: '6.3rem', marginBottom: '3rem'}}  src="/logo_gray.png" alt=""/>)}
      />
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const currentUserInfo = selectActiveUserInfo(state)
  const subscribe = currentUserInfo? currentUserInfo.subscribe: undefined
  return {
    token: selectToken(state),
    subscribe: subscribe,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  autoLogin
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Result)