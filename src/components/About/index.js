/**
 * Created by yangyang on 2017/6/28.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import { fetchWechatJssdkConfig} from '../../actions/authActions'
import wx from 'tencent-wx-jssdk'
import RedEnvelope from '../RedEnvelope'

const {
  Button,
  Panel,
  Page,
  PanelHeader,
  PanelBody,
  MediaBox,
  MediaBoxTitle,
  MediaBoxDescription,
} = WeUI


class About extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.fetchWechatJssdkConfig({
      debug: __DEV__? true: false,
      jsApiList: ['scanQRCode', 'getLocation'],
      url: window.location.href,
      success: (configInfo) => {
        wx.config(configInfo)
      },
      error: (error) => {console.log(error)}
    })
  }

  onPress = () => {
    wx.scanQRCode({
      needResult: 0,
      scanType: ["qrCode","barCode"],
      success: (res) => {
        alert(res)
      }
    })
  }

  componentDidMount() {
    document.title = "衣家宝"
  }

  render() {
    console.log("this.props", this.props)
    return (
      <Page>
        <RedEnvelope />
      </Page>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchWechatJssdkConfig
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(About)