/**
 * Created by yangyang on 2017/6/28.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button } from 'antd'
import {requestPosition} from '../../actions/configActions'
import {selectLocation} from '../../selector/configSelector'
import * as appConfig from '../../constants/appConfig'
import wx from 'tencent-wx-jssdk'



class Home extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    wx.config({
      "debug": true,
      "appId": "wx792bf5a51051d512",
      "timestamp": "1504520345",
      "nonceStr": "a0eh123ysra10yn",
      "signature": "82307404e403487f00704a3aa81a876ea1db5618",
      "jsApiList": [
        "scanQRCode"
      ]
    });
    console.log("微信js-sdk wx:", wx)
  }

  btnOnPress() {
    this.props.requestPosition({})
  }

  onScanQRCode = () => {
    wx.scanQRCode({
      needResult: 0,
      scanType: ["qrCode","barCode"],
      success: () => {}
    })
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
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)