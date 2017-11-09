/**
 * Created by wanpeng on 2017/8/11.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import {requestDeviceInfo} from '../../actions/deviceActions'
import {selectDeviceByDeviceNo} from '../../selector/deviceSelector'
import {fetchWechatJssdkConfig} from '../../actions/authActions'
import {selectWalletInfo, selectActiveUserId} from '../../selector/authSelector'
import {selectStationById} from '../../selector/stationSelector'
import * as appConfig from '../../constants/appConfig'
import WeUI from 'react-weui'
import wx from 'tencent-wx-jssdk'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './device.css'
import {socket} from '../../util/socket'
import * as errno from '../../errno'
import RedEnvelope from '../Promotion/RedEnvelope'
import {ActivityIndicator, Toast} from 'antd-mobile'
import {getMobileOperatingSystem} from '../../util'
import {selectInitUrl} from '../../selector/configSelector'

const {
  Button,
  Panel,
  PanelHeader,
  PanelBody,
  MediaBox,
  MediaBoxTitle,
  MediaBoxDescription,
  Msg,
} = WeUI

class OpenDevice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      msgTitle: undefined,
    }
  }

  componentWillMount() {
    const {params, requestDeviceInfo, fetchWechatJssdkConfig, initUrl} = this.props
    const OS = getMobileOperatingSystem()
    let jssdkURL = window.location.href
    let deviceNo = params.deviceNo
    if(deviceNo) {
      requestDeviceInfo({
        deviceNo: deviceNo,
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

  getWarnMsgTitle(status) {
    switch (status) {
      case appConfig.DEVICE_STATUS_OCCUPIED:
        return "该柜正在被使用，无法为您提供服务"
      case appConfig.DEVICE_STATUS_OFFLINE:
        return "设备下线"
      case appConfig.DEVICE_STATUS_FAULT:
        return "设备故障"
      case appConfig.DEVICE_STATUS_MAINTAIN:
        return "设备正在维修保养"
      case appConfig.DEVICE_STATUS_UNREGISTER:
        return "设备未注册"
      default:
        return "设备异常"
    }
  }

  renderDeviceStatus() {
    const {deviceInfo, stationInfo} = this.props
    const {status} = deviceInfo

    if(status === appConfig.DEVICE_STATUS_IDLE) {
      return(
        <PanelBody style={{borderBottomWidth: `0`}}>
          <MediaBox type="text">
            <MediaBoxTitle>{deviceInfo.deviceAddr}</MediaBoxTitle>
            <MediaBoxDescription style={{marginBottom: 0}}>
              请将衣物平整放入干衣柜，注意保持间隙。放置后请关门。
            </MediaBoxDescription>
          </MediaBox>
          <MediaBox type="text">
            <MediaBoxTitle>{stationInfo.unitPrice + '元／分钟'}</MediaBoxTitle>
            <MediaBoxDescription style={{marginBottom: 0}}>
              计费标准
            </MediaBoxDescription>
          </MediaBox>
          <MediaBox type="text">
            <MediaBoxTitle style={{whiteSpace: 'normal'}}>请您将衣物预先脱水甩干后再放入干衣柜</MediaBoxTitle>
            <MediaBoxDescription style={{marginBottom: 0}}>
              衣柜中有湿度探测器，在您的衣物烘干后会通过微信提醒您，届时请您及时收取衣物。
            </MediaBoxDescription>
          </MediaBox>
        </PanelBody>
      )
    } else {
      return(
        <PanelBody style={{borderBottomWidth: `0`}}>
          <Msg
            type="warn"
            title={this.getWarnMsgTitle(status)}
            description="请尝试扫码其他柜门"
          />
        </PanelBody>
      )
    }
  }



  turnOnDevice() {
    const {deviceInfo, currentUserId, location} = this.props
    Toast.loading("请稍后", 10, () => {
      Toast.info("网络错误")
    })
    socket.emit(appConfig.TURN_ON_DEVICE, {
      deviceNo: deviceInfo.deviceNo,
      userId: currentUserId,
    }, function (data) {
      let jumpPath = undefined
      var errorCode = data.errorCode
      if(errorCode === 0) {
        return
      }
      switch (errorCode) {
        case errno.EINVAL:
          Toast.fail("参数错误")
          break
        case errno.ERROR_INVALID_STATUS:
          Toast.fail("无效的设备状态")
          break
        case errno.ERROR_NO_WALLET:
          Toast.fail("用户钱包信息有误")
          break
        case errno.ERROR_NO_DEPOSIT:
          Toast.fail("用户未交押金")
          jumpPath = '/mine/deposit'
          break
        case errno.ERROR_UNPAID_ORDER:
          Toast.fail("有未支付订单")
          jumpPath = '/mine/orders'
          break
        case errno.ERROR_OCCUPIED_ORDER:
          Toast.fail("有正在使用的订单")
          jumpPath = '/mine/orders'
          break
        case errno.ERROR_TURNON_FAILED:
          Toast.fail("设备开机失败")
          break
        default:
          Toast.fail("设备开机失败, 错误: " + errorCode)
          break
      }
      browserHistory.push(jumpPath, {from: location.pathname})
    })

    //监听开机成功消息
    socket.on(appConfig.TURN_ON_DEVICE_SUCCESS, function (data) {
      Toast.success("开机成功")
      browserHistory.replace('/result' + '/开机成功' + '/success')
    })

    //监听开机失败消息
    socket.on(appConfig.TURN_ON_DEVICE_FAILED, function (data) {
      Toast.fail("开机失败")
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
    const {deviceInfo} = this.props
    if(deviceInfo.status === 0) {    //正常使用
      return "已放好衣物，开始使用"
    }  else {
      return "扫一扫"
    }
  }

  onPress = () => {
    const {deviceInfo} = this.props
    if(deviceInfo.status === 0) {
      this.turnOnDevice()
    } else{
      this.onScanQRCode()
    }
  }

  render() {
    const {params, currentUserId, deviceInfo, stationInfo} = this.props
    if(!currentUserId || !deviceInfo || !stationInfo) {
      return(<ActivityIndicator toast text="正在加载" />)
    }
    return(
      <div>
        <div className="device-banner">
          <img src={require('../../../public/logo.png')} alt="" style={{display: `block`, width: `7.5rem`, height: `6.75rem`}}/>
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
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OpenDevice)