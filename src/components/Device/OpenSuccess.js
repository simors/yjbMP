/**
 * Created by wanpeng on 2017/11/6.
 */
import React, {PureComponent} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import {selectActiveUserInfo} from '../../selector/authSelector'

const {Page, Msg,} = WeUI

class OpenSuccess extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    document.title = "开机成功"
  }
  onPress = () => {
    const {subscribe} = this.props
    if(!subscribe) {
      browserHistory.push('/focus')
      return
    }
    browserHistory.push('/mine')
  }

  render() {
    const {subscribe} = this.props
    return (
      <Page transition={true} infiniteLoader={false} ptr={false}>
        <div className="msg">
          <Msg
            type="success"
            title="开机成功"
            buttons={[{
              type: 'primary',
              label: subscribe? '确定': '关注衣家宝公众号',
              onClick: this.onPress
            }]}
            footer={() =>(<img className="logo" src="/logo_gray.png" alt=""/>)}
          />
        </div>
      </Page>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const currentUserInfo = selectActiveUserInfo(state)
  const subscribe = currentUserInfo? currentUserInfo.subscribe: undefined
  return {
    subscribe: subscribe,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OpenSuccess)