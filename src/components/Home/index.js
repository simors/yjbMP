/**
 * Created by yangyang on 2017/6/28.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button } from 'antd'
import {browserHistory} from 'react-router'
import {requestPosition} from '../../actions/configActions'
import {selectLocation} from '../../selector/configSelector'
import {fetchWechatJssdkConfig} from '../../actions/authActions'
import * as appConfig from '../../constants/appConfig'
import wx from 'tencent-wx-jssdk'

class Home extends Component {
  constructor(props) {
    super(props)
  }
  // componentWillMount() {
  //   this.props.fetchWechatJssdkConfig({
  //     debug: true,
  //     jsApiList: ['scanQRCode', 'getLocation'],
  //     url: browserHistory.getCurrentLocation().pathname,
  //     success: (configInfo) => {
  //       console.log("js config", configInfo)
  //       wx.config(configInfo)
  //     },
  //     error: (error) => {console.log(error)}
  //   })
  // }

  btnOnPress() {
    this.props.requestPosition({})
  }

  onScanQRCode = () => {
    // wx.scanQRCode({
    //   needResult: 0,
    //   scanType: ["qrCode","barCode"],
    //   success: () => {}
    // })
  }

  render() {
    return (
      <div>
        主页面
        <div>
          <Button type="primary" onClick={() => {this.btnOnPress()}}>获取地理位置</Button>
        </div>
        <div>
          {this.props.location ? this.props.location.address : ""}
        </div>
        <div>
          <Button type="primary" onClick={this.onScanQRCode}>扫一扫</Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    location: selectLocation(state)
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  requestPosition,
  fetchWechatJssdkConfig,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)