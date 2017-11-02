/**
 * Created by yangyang on 2017/6/28.
 */
import React, {Component} from 'react'
import {Link, IndexLink} from 'react-router'
import { Button, WhiteSpace, WingBlank } from 'antd-mobile';
import wx from 'tencent-wx-jssdk'
import {fetchWechatJssdkConfig} from '../actions/authActions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'



class AppIndex extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {fetchWechatJssdkConfig} = this.props
    fetchWechatJssdkConfig({
      debug: __DEV__? true: false,
      jsApiList: ['scanQRCode', 'getLocation'],
      url: window.location.href,
      success: (configInfo) => {
        wx.config(configInfo)
      },
      error: (error) => {console.log(error)}
    })
  }

  onScanQRCode() {
    wx.scanQRCode({
      needResult: 0,
      scanType: ["qrCode","barCode"],
      success: () => {}
    })
  }

  render() {
    return (
      <div style={{height: '100%'}}>
        <IndexLink to="/">主页</IndexLink>
        <WingBlank>
          <Button type="primary" onClick={() => this.onScanQRCode()}>扫一扫</Button>
        </WingBlank>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchWechatJssdkConfig,
}, dispatch)

export default connect(null, mapDispatchToProps)(AppIndex)