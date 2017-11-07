/**
 * Created by wanpeng on 2017/8/11.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import {requestDeviceInfo} from '../../actions/deviceActions'
import {selectDeviceByDeviceNo} from '../../selector/deviceSelector'
import {fetchWechatJssdkConfig, fetchWalletInfo} from '../../actions/authActions'
import {selectWalletInfo, selectActiveUserId} from '../../selector/authSelector'
import {selectStationById} from '../../selector/stationSelector'
import * as appConfig from '../../constants/appConfig'
import WeUI from 'react-weui'
import wx from 'tencent-wx-jssdk'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './device.css'
import io from 'socket.io-client'
import * as errno from '../../errno'
import RedEnvelope from '../Promotion/RedEnvelope'
import {ActivityIndicator} from 'antd-mobile'
import {getMobileOperatingSystem} from '../../util'
import {selectInitUrl} from '../../selector/configSelector'

const socket = io(appConfig.LC_SERVER_DOMAIN)

const {
  Button,
  Panel,
  PanelHeader,
  PanelBody,
  MediaBox,
  MediaBoxTitle,
  MediaBoxDescription,
  Msg,
  Toast,
  Toptips,
} = WeUI

class OpenDevice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deviceLoading: true,
      walletLoading: true,
      showLoading: false,
      showWarn: false,
      warnTips: "",
    }
  }

  componentWillMount() {
    const {params, requestDeviceInfo, fetchWalletInfo, fetchWechatJssdkConfig, currentUserId, initUrl} = this.props
    const OS = getMobileOperatingSystem()
    let jssdkURL = window.location.href
    let deviceNo = params.deviceNo
    if(deviceNo) {
      requestDeviceInfo({
        deviceNo: deviceNo,
        success: () => {this.setState({deviceLoading: false})},
        error: (error) => {this.setState({deviceLoading: false})}
      })
    }
    if(currentUserId) {
      fetchWalletInfo({
        success: () => {this.setState({walletLoading: false})},
        error: (error) => {this.setState({walletLoading: false})}
      })
    }
    if(OS === 'iOS') {
      //微信JS-SDK Bug: SPA(单页应用)ios系统必须使用首次加载的url初始化jssdk
      jssdkURL = initUrl
    }
    fetchWechatJssdkConfig({
      debug: __DEV__? true: false,
      jsApiList: ['scanQRCode', 'getLocation'],
      url: jssdkURL,
      success: (configInfo) => {
        wx.config(configInfo)
      },
      error: (error) => {console.log(error)}
    })
  }

  componentWillReceiveProps(newProps) {
    const {currentUserId, fetchWalletInfo} = newProps
    if(currentUserId && this.props.currentUserId != currentUserId) {
      fetchWalletInfo({
        success: () => {this.setState({walletLoading: false})},
        error: (error) => {this.setState({walletLoading: false})}
      })
    }
  }

  renderDeviceStatus() {
    const {deviceInfo, walletInfo, stationInfo} = this.props
    let status = deviceInfo? deviceInfo.status : undefined
    if(!deviceInfo || !walletInfo || !stationInfo) {
      return null
    }
    if(walletInfo.deposit === 0 || walletInfo.process === appConfig.WALLET_PROCESS_TYPE_REFUND) {  //未交押金
      return(
        <PanelBody style={{borderBottomWidth: `0`}}>
          <Msg
            type="warn"
            title="您尚未支付押金"
            description="请点击下方按钮支付押金。支付成功后请再次扫码开柜。"
          />
        </PanelBody>
      )
    } else if(walletInfo.debt > 0) { //欠费
      return(
        <PanelBody style={{borderBottomWidth: `0`}}>
          <Msg
            type="warn"
            title="您尚有未支付的订单"
            description="请点击下方按钮查看历史订单，并对欠费订单进行支付。支付成功后请再次扫码开柜。"
          />
        </PanelBody>
      )
    } else {
      switch (status) {
        case appConfig.DEVICE_STATUS_IDLE:
          return(
            <PanelBody style={{borderBottomWidth: `0`}}>
              <MediaBox type="text">
                <MediaBoxTitle>{deviceInfo.deviceAddr}</MediaBoxTitle>
                <MediaBoxDescription>
                  请将衣物平整放入干衣柜，注意保持间隙。放置后请关门。
                </MediaBoxDescription>
              </MediaBox>
              <MediaBox type="text">
                <MediaBoxTitle>{stationInfo.unitPrice + '元／分钟'}</MediaBoxTitle>
                <MediaBoxDescription>
                  计费标准
                </MediaBoxDescription>
              </MediaBox>
              <MediaBox type="text">
                <MediaBoxTitle>请您将衣物预先脱水甩干后再放入干衣柜</MediaBoxTitle>
                <MediaBoxDescription>
                  衣柜中有湿度探测器，在您的衣物烘干后会通过微信提醒您，届时请您及时收取衣物。
                </MediaBoxDescription>
              </MediaBox>
            </PanelBody>
          )
        case appConfig.DEVICE_STATUS_OCCUPIED:
          return(
            <PanelBody style={{borderBottomWidth: `0`}}>
              <Msg
                type="warn"
                title="该柜正在被使用，无法为您提供服务"
                description="请尝试扫码其他柜门"
              />
            </PanelBody>
          )
        case appConfig.DEVICE_STATUS_OFFLINE:
          return(
            <PanelBody style={{borderBottomWidth: `0`}}>
              <Msg
                type="info"
                title="设备下线"
                description="请尝试扫码其他柜门"
              />
            </PanelBody>
          )
        case appConfig.DEVICE_STATUS_FAULT:
          return(
            <PanelBody style={{borderBottomWidth: `0`}}>
              <Msg
                type="info"
                title="设备故障"
                description="请尝试扫码其他柜门"
              />
            </PanelBody>
          )
        case appConfig.DEVICE_STATUS_MAINTAIN:
          return(
            <PanelBody style={{borderBottomWidth: `0`}}>
              <Msg
                type="info"
                title="设备维修保养"
                description="请尝试扫码其他柜门"
              />
            </PanelBody>
          )
        case appConfig.DEVICE_STATUS_UNREGISTER:
          return(
            <PanelBody style={{borderBottomWidth: `0`}}>
              <Msg
                type="info"
                title="设备未注册"
                description="请尝试扫码其他柜门"
              />
            </PanelBody>
          )
        default:
          return null
      }
    }
  }



  turnOnDevice() {
    const {deviceInfo, currentUserId, location} = this.props
    var that = this
    that.setState({
      showLoading: true
    })
    //发送开机请求
    socket.emit(appConfig.TURN_ON_DEVICE, {
      deviceNo: deviceInfo.deviceNo,
      userId: currentUserId,
    }, function (data) {
      let jumpPath = undefined
      var errorCode = data.errorCode
      if(errorCode === 0) {
        return
      }
      that.setState({ showLoading: false })
      switch (errorCode) {
        case errno.EINVAL:
          that.setState({showWarn: true, warnTips: "参数错误"})
          break
        case errno.ERROR_INVALID_STATUS:
          that.setState({showWarn: true, warnTips: "无效的设备状态"})
          break
        case errno.ERROR_NO_WALLET:
          that.setState({showWarn: true, warnTips: "用户钱包信息有误"})
          break
        case errno.ERROR_NO_DEPOSIT:
          that.setState({showWarn: true, warnTips: "用户未交押金"})
          jumpPath = '/mine/deposit'
          break
        case errno.ERROR_UNPAID_ORDER:
          that.setState({showWarn: true, warnTips: "有未支付订单"})
          jumpPath = '/mine/orders'
          break
        case errno.ERROR_OCCUPIED_ORDER:
          that.setState({showWarn: true, warnTips: "有正在使用的订单"})
          jumpPath = '/mine/orders'
          break
        case errno.ERROR_TURNON_FAILED:
          that.setState({showWarn: true, warnTips: "设备开机失败"})
          break
        default:
          that.setState({showWarn: true, warnTips: "内部错误：" + errorCode})
          break
      }
      setTimeout(function () {
        that.setState({showWarn: false, warnTips: ""})
        browserHistory.push(jumpPath, {from: location.pathname})
      }, 3000)
    })

    //监听开机成功消息
    socket.on(appConfig.TURN_ON_DEVICE_SUCCESS, function (data) {
      that.setState({showLoading: false})
      browserHistory.push('/result' + '/开机成功' + '/success')
    })

    //监听开机失败消息
    socket.on(appConfig.TURN_ON_DEVICE_FAILED, function (data) {
      console.log("收到开机失败消息", data)
      that.setState({showLoading: false})

    })
  }

  onScanQRCode() {
    wx.scanQRCode({
      needResult: 0,
      scanType: ["qrCode","barCode"],
      success: () => {}
    })
  }

  getButtonTitle() {
    const {walletInfo, deviceInfo} = this.props
    if(!walletInfo || !deviceInfo) {
      return "扫一扫"
    }
    if(walletInfo.debt > 0) {               //欠费
      return "去支付"
    } else if(walletInfo.deposit === 0 || walletInfo.process === appConfig.WALLET_PROCESS_TYPE_REFUND) {   //押金
      return "交押金"
    } else if(deviceInfo.status === 0) {    //正常使用
      return "已放好衣物，开始使用"
    }  else {
      return "扫一扫"
    }
  }

  onPress = () => {
    const {walletInfo, deviceInfo, location} = this.props
    if(walletInfo.deposit === 0 || walletInfo.process === appConfig.WALLET_PROCESS_TYPE_REFUND) {
      browserHistory.push('/mine/deposit')
    } else if(walletInfo.debt > 0) { //欠费
      browserHistory.push('/mine/orders', {from: location.pathname})
    } else if(deviceInfo.status === 0) { //空闲
      this.turnOnDevice()
    } else{
      this.onScanQRCode()
    }
  }

  render() {
    const {params, currentUserId} = this.props
    const {deviceLoading, walletLoading, showLoading} = this.state
    if(!currentUserId) {
      return(<ActivityIndicator toast text="正在加载" />)
    }
    return(
      <div>
        <div className="device-banner">
          <img src="/logo.png" alt="" style={{display: `block`, width: `7.5rem`, height: `6.75rem`}}/>
        </div>
        <div>
          <Panel style={{marginTop: `0`}}>
            <PanelHeader>
              {'设备编号：' + params.deviceNo}
            </PanelHeader>
            {this.renderDeviceStatus()}
          </Panel>
        </div>
        <div className="device-button">
          <Button onClick={this.onPress}>{this.getButtonTitle()}</Button>
        </div>
        <Toast icon="loading" show={deviceLoading || walletLoading || showLoading}>加载...</Toast>
        <Toptips type="warn" show={this.state.showWarn}>{this.state.warnTips}</Toptips>
        <RedEnvelope />
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  const {params} = ownProps
  let deviceNo = params.deviceNo
  let deviceInfo = selectDeviceByDeviceNo(state, deviceNo)
  let stationInfo = deviceInfo? selectStationById(state, deviceInfo.stationId) : undefined

  return {
    deviceInfo: deviceInfo,
    stationInfo: stationInfo,
    currentUserId: selectActiveUserId(state),
    walletInfo: selectWalletInfo(state),
    initUrl: selectInitUrl(state)
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  requestDeviceInfo,
  fetchWechatJssdkConfig,
  fetchWalletInfo,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OpenDevice)