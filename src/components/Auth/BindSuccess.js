/**
 * Created by wanpeng on 2017/8/11.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'

import './bindsuccess.css'
const {Page, Msg} = WeUI

class BindSuccess extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    document.title = "绑定手机"
  }

  render() {
    return (
      <Page transition={true} infiniteLoader={true} ptr={false}>
        <div className="msg">
          <Msg
            type="success"
            title="绑定成功"
            description="请关注衣家宝公众号，进行后续操作！"
            buttons={[{
              type: 'primary',
              label: '关注衣家宝公众号',
              onClick: () => {browserHistory.push('/focus')}
            }]}
          />
        </div>
        <div className="footer">
          <img className="logo" src="/logo_gray.png" alt=""/>
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

export default connect(mapStateToProps, mapDispatchToProps)(BindSuccess)