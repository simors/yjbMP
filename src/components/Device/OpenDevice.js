/**
 * Created by wanpeng on 2017/8/11.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import {requestDeviceInfo} from '../../actions/deviceActions'
import {selectDeviceInfo} from '../../selector/deviceSelector'
import {fetchOrderInfo} from '../../actions/authActions'
import {selectUserInfo} from '../../selector/authSelector'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './device.css'
import io from 'socket.io-client'

const socket = io('http://localhost:3000')

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
    this.props.requestDeviceInfo({
      deviceNo: deviceNo,
    })
    this.setState({
      deviceNo: deviceNo,
    })
  }

  renderDeviceStatus() {
    if(this.props.currentUser.balance < 0) { //欠费
      return(
        <PanelBody style={{borderBottomWidth: `0`}}>
          <Msg
            type="warn"
            title="您尚有未支付的订单"
            description="请点击下方按钮查看历史订单，并对欠费订单进行支付。支付成功后请再次扫码开柜。"
          />
        </PanelBody>
      )
    } else if(this.props.deviceInfo.status === 0) { //空闲
      return(
        <PanelBody style={{borderBottomWidth: `0`}}>
          <MediaBox type="text">
            <MediaBoxTitle>13号柜门可使用</MediaBoxTitle>
            <MediaBoxDescription>
              请将衣物平整放入干衣柜，注意保持间隙。放置后请关门。
            </MediaBoxDescription>
          </MediaBox>
          <MediaBox type="text">
            <MediaBoxTitle>2元/小时</MediaBoxTitle>
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
    } else if(this.props.currentUser.balance < 0) { //欠费
      return "去支付"
    } else if(this.props.deviceInfo.status === 0) { //空闲
      return "开门"
    } else if(this.props.deviceInfo.status === 1) {  //使用中
      return "扫一扫"
    } else if(this.props.deviceInfo.status === 2) {  //下线
      return "扫一扫"
    } else {
      return "扫一扫"
    }
  }

  turnOnDevice() {
    var that = this
    that.setState({
      loading: true
    })
    //发送开机请求
    socket.emit('turn_on_device', {
      deviceNo: this.props.deviceInfo.deviceNo,
      userId: this.props.currentUser.id,
    }, function (data) {
      console.log("socket.emit", data)
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
    socket.on('turn_on_device_success', function (data) {
      console.log("收到开机成功消息", data)
      var orderInfo = data
      that.setState({
        loading: false
      })

      this.props.fetchOrderInfo({
        orderInfo: orderInfo,
        success: () => {browserHistory.replace('/mine/orders')},
        error: (error) => {console.log(error)}
      })
    })

    //监听开机失败消息
    socket.on('turn_on_device_failed', function (data) {
      console.log("收到开机失败消息", data)
      that.setState({
        loading: false
      })

    })
  }

  onPress = () => {
    if(this.props.currentUser.balance < 0) { //欠费

    } else if(this.props.deviceInfo.status === 0) { //空闲
      this.turnOnDevice()
    } else if(this.props.deviceInfo.status === 1) {  //使用中
    } else if(this.props.deviceInfo.status === 2) {  //下线
    } else {
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
        <div className="device-button-area" onClick={this.onPress}>
          <Button className='device-button'>{this.getButtonTitle()}</Button>
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
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  requestDeviceInfo,
  fetchOrderInfo
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OpenDevice)