/**
 * Created by wanpeng on 2017/8/21.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import {requestUserinfo, requestSmsCode, submitRegister} from '../../actions/authActions'
import {selectWechatUserInfo} from '../../selector/authSelector'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './bind.css'

const {
  Page,
  Button,
  CellHeader,
  CellBody,
  CellFooter,
  Form,
  FormCell,
  Input,
  Label,
  Select,
  Toptips,
} = WeUI

class Bind extends Component {

  constructor(props) {
    super(props)
    this.state = {
      wechatUserInfo: undefined,
      areaCode: "+86",
      phone: undefined,
      smsCode: undefined,
      smsCodeDisable: false,
      smsCodeTrip: '获取',
      showWarn: false,
      warnTips: ""
    }
    this.wait = 60 //倒计时60s
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  componentDidMount() {
    document.title = "绑定手机"
  }

  requestUserinfoSuccessCallback = (userInfo) => {
    let nextPathname = this.props.location.query.state || '/mine'

    var isBind = userInfo.isBind
    if(isBind) {
      browserHistory.replace(nextPathname)
    } else {
      this.setState({
        wechatUserInfo: userInfo
      })
    }
  }

  componentWillMount() {
    var code = this.props.location.query.code
    if(code) {
      this.props.requestUserinfo({
        code: code,
        success: this.requestUserinfoSuccessCallback,
        error: (error) => {
          console.log("Bind error", error)
        }
      })
    }
  }

  getSmsCode = () => {
    var that = this
    if(this.wait === 0) {
      this.setState({
        smsCodeDisable: false,
        smsCodeTrip: '获取'
      })
      this.wait = 60
    } else if(this.wait === 60) {
      var result = this.phoneCheck()
      if(!result) {
        return
      }
      this.props.requestSmsCode({
        phone: this.state.areaCode + this.state.phone,
        success: () => {
          this.setState({
            smsCodeDisable: true,
            smsCodeTrip: this.wait + 's后重新发送'
          })
          this.wait--
          setTimeout(function () {
            that.getSmsCode()
          }, 1000)
        },
        error: (error) => {
          this.setState({
            showWarn: true,
            warnTips: "短信验证码请求失败"
          })
          setTimeout(function () {
            that.setState({
              showWarn: false,
              warnTips: ""
            })
          }, 2000)
        }
      })
    } else {
      this.setState({
        smsCodeDisable: true,
        smsCodeTrip: this.wait + 's后重新发送'
      })
      this.wait--
      setTimeout(function () {
        that.getSmsCode()}, 1000)
    }
  }

  handleInputChange(event) {
    const target = event.target
    const name = target.name
    this.setState({[name]: event.target.value});
  }

  phoneCheck() {
    var that = this
    if(!this.state.phone) {
      this.setState({
        showWarn: true,
        warnTips: "请输入手机号码"
      })
      setTimeout(function () {
        that.setState({
          showWarn: false,
          warnTips: ""
        })
      }, 2000)
      return false
    }

    var reg = /^1[0-9]{10}$/
    if(!reg.test(this.state.phone)) {
      this.setState({
        showWarn: true,
        warnTips: "手机号码格式有误"
      })
      setTimeout(function () {
        that.setState({
          showWarn: false,
          warnTips: ""
        })
      }, 2000)
      return false
    }

    return true
  }

  formCheck() {
    var that = this
    var result = this.phoneCheck()
    if(!result) {
      return false
    }

    if(!this.state.smsCode) {
      this.setState({
        showWarn: true,
        warnTips: "手机号码格式有误"
      })
      setTimeout(function () {
        that.setState({
          showWarn: false,
          warnTips: ""
        })
      }, 2000)
      return false
    }

    return true
  }

  submit = () => {
    var that = this
    var result = this.formCheck()
    if(!result) {
      return
    }
    this.props.submitRegister({
      phone: this.state.phone,
      smsCode: this.state.smsCode,
      wechatUserInfo: this.state.wechatUserInfo,
      success: () => {
        let deviceNo = this.props.location.query.deviceNo
        if(deviceNo) {
          browserHistory.replace('/openDevice?deviceNo=' + deviceNo)
        } else {
          browserHistory.replace('/bind/success')
        }
      },
      error: (error) => {
        this.setState({
          showWarn: true,
          warnTips: error
        })
        setTimeout(function () {
          that.setState({
            showWarn: false,
            warnTips: ""
          })
        }, 2000)
      }
    })
  }

  render() {
    return (
      <Page className="page" ptr={false} infiniteLoader={false}>
        <div className="header">
          <img className="avatar" src={this.state.wechatUserInfo? this.state.wechatUserInfo.headimgurl: '/defaultAvatar.svg'} alt=""/>
        </div>
        <div>
          <Form className="form">
            <FormCell select selectPos="before">
              <CellHeader>
                <Select name="areaCode" defaultValue="1" onChange={this.handleInputChange}>
                  <option value="+86">+86</option>
                  <option value="+80">+80</option>
                  <option value="+84">+84</option>
                  <option value="+87">+87</option>
                </Select>
              </CellHeader>
              <CellBody>
                <Input name="phone" type="tel" placeholder="请输入手机号码" onChange={this.handleInputChange}/>
              </CellBody>
            </FormCell>
            <FormCell vcode>
              <CellHeader>
                <Label>验证码</Label>
              </CellHeader>
              <CellBody>
                <Input name="smsCode" type="number" placeholder="请输入验证码" onChange={this.handleInputChange}/>
              </CellBody>
              <CellFooter>
                <Button
                  type="vcode"
                  disabled={this.state.smsCodeDisable}
                  onClick={this.getSmsCode}
                  style={this.state.smsCodeDisable? {} : {color: `#00C203`}}>
                  {this.state.smsCodeTrip}
                </Button>
              </CellFooter>
            </FormCell>
          </Form>
        </div>
        <div className="button">
          <Button onClick={this.submit}>绑定</Button>
        </div>
        <div className="bind-footer">
          <img className="bind-logo" src="/logo_gray.png" alt=""/>
        </div>
        <Toptips type="warn" show={this.state.showWarn}>{this.state.warnTips}</Toptips>
      </Page>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  requestUserinfo,
  requestSmsCode,
  submitRegister,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Bind)