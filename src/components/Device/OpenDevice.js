/**
 * Created by wanpeng on 2017/8/11.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import {requestDeviceInfo} from '../../actions/deviceActions'
import {selectDeviceInfo} from '../../selector/deviceSelector'
import {fetchOrderInfo, fetchWechatJssdkConfig} from '../../actions/authActions'
import {selectUserInfo, selectWalletInfo} from '../../selector/authSelector'
import * as appConfig from '../../constants/appConfig'
import WeUI from 'react-weui'
import wx from 'tencent-wx-jssdk'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './device.css'
import io from 'socket.io-client'

const socket = io(appConfig.LC_SERVER_DOMAIN)

const {
  Button,
  Panel,
  Page,
  PanelHeader,
  PanelBody,
  MediaBox,
  MediaBoxTitle,
  MediaBoxDescription,
  Msg,
  LoadMore,
} = WeUI

class OpenDevice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deviceNo: undefined,
      buttonTitle: undefined,
      loading: false,
    }
  }

  componentWillMount() {
    var deviceNo = this.props.location.query.deviceNo
    this.props.requestDeviceInfo({deviceNo: deviceNo})
    this.setState({deviceNo: deviceNo})
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

  componentDidMount() {
    document.title = "开机"
  }

  renderDeviceStatus() {
    if(this.props.walletInfo.deposit === 0) {  //未交押金
      return(
        <PanelBody style={{borderBottomWidth: `0`}}>
          <Msg
            type="warn"
            title="您尚未支付押金"
            description="请点击下方按钮支付押金。支付成功后请再次扫码开柜。"
          />
        </PanelBody>
      )
    } else if(this.props.walletInfo.debt > 0) { //欠费
      return(
        <PanelBody style={{borderBottomWidth: `0`}}>
          <Msg
            type="warn"
            title="您尚有未支付的订单"
            description="请点击下方按钮查看历史订单，并对欠费订单进行支付。支付成功后请再次扫码开柜。"
          />
        </PanelBody>
      )
    } else if(this.props.deviceInfo.status === undefined) {
      return(
        <PanelBody style={{borderBottomWidth: `0`}}>
          <Msg
            type="warn"
            title="无效的设备"
            description="请尝试扫描其他设备，或联系客服"
          />
        </PanelBody>
      )
    } else if(this.props.deviceInfo.status === 0) { //空闲
      return(
        <PanelBody style={{borderBottomWidth: `0`}}>
          <MediaBox type="text">
            <MediaBoxTitle>{this.props.deviceInfo.deviceAddr}</MediaBoxTitle>
            <MediaBoxDescription>
              请将衣物平整放入干衣柜，注意保持间隙。放置后请关门。
            </MediaBoxDescription>
          </MediaBox>
          <MediaBox type="text">
            <MediaBoxTitle>{this.props.deviceInfo.unitPrice + '元／分钟'}</MediaBoxTitle>
            <MediaBoxDescription>
              计费标准
            </MediaBoxDescription>
          </MediaBox>
          <Button type="warn">获得运气红包 1 元，轻触领取</Button>
          <MediaBox type="text">
            <MediaBoxTitle>请您将衣物预先脱水甩干后再放入干衣柜</MediaBoxTitle>
            <MediaBoxDescription>
              衣柜中有湿度探测器，在您的衣物烘干后会通过微信提醒您，届时请您及时收取衣物。
            </MediaBoxDescription>
          </MediaBox>

        </PanelBody>
      )
    } else if(this.props.deviceInfo.status === 1) {  //使用中
      return(
        <PanelBody style={{borderBottomWidth: `0`}}>
          <Msg
            type="warn"
            title="该柜正在被使用，无法为您提供服务"
            description="请尝试扫码其他柜门"
          />
        </PanelBody>
      )
    } else if(this.props.deviceInfo.status === 2) {  //下线
      return(
        <PanelBody style={{borderBottomWidth: `0`}}>
          <Msg
            type="info"
            title="设备故障"
            description="请尝试扫码其他柜门"
          />
        </PanelBody>
      )
    } else {
      return(
        <PanelBody style={{borderWidth: `0`}}>
          <LoadMore loading>加载中</LoadMore>
        </PanelBody>
      )
    }
  }

  getButtonTitle() {
    if(this.state.loading) {
      return(
        <LoadMore className="device-loadmore" loading/>
      )
    } else if(this.props.walletInfo.debt > 0) { //欠费
      return "去支付"
    } else if(this.props.walletInfo.deposit === 0) {
      return "交押金"
    } else if(this.props.deviceInfo.status === 0) { //空闲
      return "开门"
    }  else {
      return "扫一扫"
    }
  }

  turnOnDevice() {
    var that = this
    that.setState({
      loading: true
    })
    //发送开机请求
    socket.emit(appConfig.TURN_ON_DEVICE, {
      deviceNo: this.props.deviceInfo.deviceNo,
      userId: this.props.currentUser.id,
    }, function (data) {
      var errorCode = data.errorCode
      if(errorCode != 0) {
        that.setState({
          loading: false
        })
        console.log("开机请求失败", data.errorMessage)
        //TODO 提示开机请求失败原因
      }
    })

    //监听开机成功消息
    socket.on(appConfig.TURN_ON_DEVICE_SUCCESS, function (data) {
      console.log("收到开机成功消息", data)
      var orderInfo = data
      that.setState({
        loading: false
      })

      browserHistory.replace('/mine/orders')
      // this.props.fetchOrderInfo({
      //   orderInfo: orderInfo,
      //   success: () => {browserHistory.replace('/mine/orders')},
      //   error: (error) => {console.log(error)}
      // })
    })

    //监听开机失败消息
    socket.on(appConfig.TURN_ON_DEVICE_FAILED, function (data) {
      console.log("收到开机失败消息", data)
      that.setState({
        loading: false
      })

    })
  }

  onScanQRCode() {
    wx.scanQRCode({
      needResult: 0,
      scanType: ["qrCode","barCode"],
      success: () => {}
    })
  }

  onPress = () => {
    if(this.props.walletInfo.deposit === 0) {
      browserHistory.push('/mine/wallet')
    } else if(this.props.walletInfo.debt > 0) { //欠费
      browserHistory.push('/mine/orders')
    } else if(this.props.deviceInfo.status === 0) { //空闲
      this.turnOnDevice()
    } else{
      this.onScanQRCode()
    }
  }

  render() {
    return(
      <Page ptr={false} infiniteLoader={false}>
        <div className="device-banner">
          <img src="/logo.png" alt="" style={{display: `block`, width: `7.5rem`, height: `6.75rem`}}/>
        </div>
        <Panel style={{marginTop: `0`}}>
          <PanelHeader>
            {'设备编号：' + this.state.deviceNo}
          </PanelHeader>
          {this.renderDeviceStatus()}
        </Panel>
        <div className="device-button-area" >
          <Button className='device-button' onClick={this.onPress}>{this.getButtonTitle()}</Button>
        </div>
      </Page>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  var deviceInfo = selectDeviceInfo(state)
  return {
    deviceInfo: deviceInfo,
    currentUser: selectUserInfo(state),
    walletInfo: selectWalletInfo(state),
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  requestDeviceInfo,
  fetchOrderInfo,
  fetchWechatJssdkConfig,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OpenDevice)