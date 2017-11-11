/**
 * Created by wanpeng on 2017/10/25.
 */
import React, {PureComponent} from 'react'
import {browserHistory} from 'react-router'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './bindsuccess.css'

const {Page, Msg,} = WeUI

export default class AuthSuccess extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    document.title = "认证成功"
  }

  render() {
    return (
      <Page transition={true} infiniteLoader={true} ptr={false}>
        <div className="msg">
          <Msg
            type="success"
            title="认证成功"
            buttons={[{
              type: 'primary',
              label: '关注衣家宝公众号',
              onClick: () => {browserHistory.push('/focus')}
            }]}
            footer={() =>(<img className="logo" style={{padding: '0.5rem'}} src="/logo_gray.png" alt=""/>)}
          />
        </div>
      </Page>
    )
  }

}
