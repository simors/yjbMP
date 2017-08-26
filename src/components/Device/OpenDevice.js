/**
 * Created by wanpeng on 2017/8/11.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {requestDeviceInfo} from '../../actions/deviceActions'
import {selectDeviceInfo} from '../../selector/deviceSelector'
import {selectUserInfo} from '../../selector/authSelector'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './device.css'

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
      deviceid: undefined,
      buttonTitle: undefined,
    }
  }

  componentWillMount() {
    var deviceid = this.props.location.query.deviceid
    this.props.requestDeviceInfo({
      deviceid: deviceid,
    })
    this.setState({
      deviceid: deviceid,
    })
  }

  renderDeviceStatus() {
    if(this.props.userInfo.balance < 0) { //欠费
      return(
        <PanelBody style={{height: `22rem`}}>
          <Msg
            type="warn"
            title="您尚有未支付的订单"
            description="请点击下方按钮查看历史订单，并对欠费订单进行支付。支付成功后请再次扫码开柜。"
          />
        </PanelBody>
      )
    } else if(this.props.deviceInfo === 0) { //空闲
      return(
        <PanelBody>
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
    } else if(this.props.deviceInfo === 1) {  //使用中
      return(
        <PanelBody style={{height: `22rem`}}>
          <Msg
            type="warn"
            title="该柜正在被使用，无法为您提供服务"
            description="请尝试扫码其他柜门"
          />
        </PanelBody>
      )
    } else if(this.props.deviceInfo === 2) {  //下线
      return(
        <PanelBody>

        </PanelBody>
      )
    } else {
      return(
        <PanelBody style={{height: `22rem`}}>
          <LoadMore loading>加载中</LoadMore>
        </PanelBody>
      )
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
            {'设备编号：' + this.state.deviceid}
          </PanelHeader>
          {/*{this.renderDeviceStatus()}*/}
          <PanelBody style={{height: `22rem`}}>
            <LoadMore loading>加载中</LoadMore>
          </PanelBody>
        </Panel>
        <div className="device-button">
          <Button>开门</Button>
        </div>
      </Page>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  var deviceInfo = selectDeviceInfo(state)
  var userInfo = selectUserInfo(state)
  return {
    deviceInfo: deviceInfo,
    userInfo: userInfo,
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  requestDeviceInfo
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OpenDevice)