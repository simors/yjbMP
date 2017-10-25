/**
 * Created by wanpeng on 2017/10/25.
 */
import React, {PureComponent} from 'react'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import * as appConfig from '../../constants/appConfig'
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
              onClick: () => {document.location = appConfig.FOCUS_MP_URL}
            }]}
            footer={() =>(<img className="logo" src="/logo_gray.png" alt=""/>)}
          />
        </div>
      </Page>
    )
  }

}
