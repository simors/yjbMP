/**
 * Created by wanpeng on 2017/8/17.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import {requestVerifyIdName} from '../../actions/authActions'
import {selectUserInfo} from '../../selector/authSelector'

import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'

const {
  Cell,
  Cells,
  CellBody,
  CellFooter,
  Button,
  Panel,
  Page,
  PanelHeader,
  PanelBody,
  MediaBox,
  MediaBoxTitle,
  MediaBoxDescription,
  Form,
  FormCell,
  CellHeader,
  CellsTitle,
  Label,
  Input
} = WeUI

class Certification extends Component {
  constructor(props) {
    super(props)
    this.state = {
      idName: undefined,
      idNumber: undefined,
      showWarn: false,
      warnTips: ""
    }
  }

  componentDidMount() {
    document.title = "实名认证"
  }

  handleInputChange(event) {
    const target = event.target
    const name = target.name
    this.setState({[name]: event.target.value});
  }

  submit = () => {
    if(!this.state.idName) {
      this.setState({
        showWarn: true,
        warnTips: "请输入真实姓名"
      })
      setTimeout(function () {
        that.setState({
          showWarn: false,
          warnTips: ""
        })
      }, 2000)
      return
    }
    if(!this.state.idNumber) {
      this.setState({
        showWarn: true,
        warnTips: "请输入身份证号码"
      })
      setTimeout(function () {
        that.setState({
          showWarn: false,
          warnTips: ""
        })
      }, 2000)
      return
    }
    this.props.requestVerifyIdName({
      userId: this.props.currentUser.id,
      idName: this.state.idName,
      idNumber: this.state.idNumber,
      success: () => {browserHistory.goBack()},
      error: (error) => {console.log("requestVerifyIdName", error)}
    })
  }

  render() {
    return(
      <Page>
        <CellsTitle>请输入您本人的真实信息。</CellsTitle>
        <Form>
          <FormCell>
            <CellHeader>
              <Label>真实姓名</Label>
            </CellHeader>
            <CellBody>
              <Input name="idName" type="text" placeholder="请输入" onChange={this.handleInputChange}/>
            </CellBody>
          </FormCell>
          <FormCell>
            <CellHeader>
              <Label>身份证号</Label>
            </CellHeader>
            <CellBody>
              <Input name="idNumber" type="text" placeholder="请输入" onChange={this.handleInputChange}/>
            </CellBody>
          </FormCell>
        </Form>
        <div className="button">
          <Button onClick={this.submit}>提交</Button>
        </div>
        <Toptips type="warn" show={this.state.showWarn}>{this.state.warnTips}</Toptips>
      </Page>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectUserInfo(state)
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  requestVerifyIdName
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Certification)