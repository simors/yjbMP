/**
 * Created by wanpeng on 2017/8/11.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import {selectActiveUserInfo} from '../../selector/authSelector'

import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'

const {
  Cell,
  Cells,
  CellBody,
  CellFooter,
  Page,
} = WeUI

class ModifyProfile extends  Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    document.title = "修改资料"
  }

  idVerifyStatus() {
    if(this.props.currentUser.idNameVerified) {
      return "已认证"
    } else if(this.props.currentUser.idName && this.props.currentUser.idNumber) {
      return '审核中'
    } else {
      return "未认证"
    }
  }

  getIdLinkAccess() {
    if(this.props.currentUser.idNameVerified) {
      return false
    } else if(this.props.currentUser.idName && this.props.currentUser.idNumber) {
      return false
    } else {
      return true
    }
  }

  onIdVerify = () => {
    if(this.props.currentUser.idNameVerified) {
      return
    } else if(this.props.currentUser.idName && this.props.currentUser.idNumber) {
      return
    } else {
      browserHistory.push('/modifyProfile/certification')
    }
  }

  render() {
    return(
      <Page ptr={false}>
        <Cells>
          <Cell access>
            <CellBody>
              头像
            </CellBody>
            <CellFooter>
              <img src={this.props.currentUser.avatar || require('../../../public/defaultAvatar.svg')} alt="" style={{display: `block`, width: `3.13rem`, marginRight: `0.63rem`}}/>
            </CellFooter>
          </Cell>
        </Cells>
        <Cells>
          <Cell access>
            <CellBody>
              昵称
            </CellBody>
            <CellFooter>
              {this.props.currentUser.nickname}
            </CellFooter>
          </Cell>
          <Cell>
            <CellBody>
              姓名
            </CellBody>
            <CellFooter>
              {this.props.currentUser.idName || ""}
            </CellFooter>
          </Cell>
          <Cell access={this.getIdLinkAccess()} onClick={this.onIdVerify}>
            <CellBody>
              实名认证
            </CellBody>
            <CellFooter>
              {this.idVerifyStatus()}
            </CellFooter>
          </Cell>
          <Cell>
            <CellBody>
              手机号码
            </CellBody>
            <CellFooter>
              {this.props.currentUser.mobilePhoneNumber}
            </CellFooter>
          </Cell>

        </Cells>
      </Page>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectActiveUserInfo(state)
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ModifyProfile)