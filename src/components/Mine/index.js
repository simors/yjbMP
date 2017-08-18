/**
 * Created by wanpeng on 2017/8/11.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import {requestWechatUserinfo} from '../../actions/authActions'
import {selectUserInfo} from '../../selector/authSelector'
import WeUI from 'react-weui'
import './mine.css'

const {
  Button,
  Page,
  Cells,
  Cell,
  CellHeader,
  CellBody,
  CellFooter,
  Form,
  FormCell,
  Input,
  Label,
  Select,
} = WeUI

class Mine extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    document.title = "个人中心"
  }

  componentWillMount() {

  }

  render() {
    return (
      <Page ptr={false} style={{backgroundColor: `#EFEFF4`}}>
        <div className="container">
          <img src="/logo.png" alt="" style={{display: `block`, width: `7.5rem`, height: `6.75rem`}}/>
        </div>

        <Cells style={{marginTop: 0}}>
          <Cell href="/modifyProfile" access>
            <CellHeader>
              <img src={this.props.profile.avatar || '/defaultAvatar.svg'} alt="" style={{display: `block`, width: `3.13rem`, marginRight: `0.63rem`}}/>
            </CellHeader>
            <CellBody primary={true}>
              <h6>{this.props.profile.nickname || '衣家宝'}</h6>
              <p style={{fontSize: `0.9rem`, marginTop: `0.1rem`}}>普通用户</p>
            </CellBody>
            <CellFooter style={{fontSize: `1.1rem`}}>
              修改资料
            </CellFooter>
          </Cell>
        </Cells>

        <Cells>
          <Cell href="mine/score" access>
            <CellHeader>
              <img src="/score.png" alt="" style={{display: `block`, width: `1.3rem`, marginRight: `1.1rem`}}/>
            </CellHeader>
            <CellBody>
              积分
            </CellBody>
            <CellFooter/>
          </Cell>
          <Cell href="/mine/wallet" access>
            <CellHeader>
              <img src="/wallet.png" alt="" style={{display: `block`, width: `1.3rem`, marginRight: `1.1rem`}}/>
            </CellHeader>
            <CellBody>
              钱包
            </CellBody>
            <CellFooter/>
          </Cell>
          <Cell href="mine/orders" access>
            <CellHeader>
              <img src="/order.png" alt="" style={{display: `block`, width: `1.3rem`, marginRight: `1.1rem`}}/>
            </CellHeader>
            <CellBody>
              历史订单
            </CellBody>
            <CellFooter/>
          </Cell>
        </Cells>

        <Cells>
          <Cell href="/about" access>
            <CellHeader>
              <img src="/about_us.png" alt="" style={{display: `block`, width: `1.3rem`, marginRight: `1.1rem`}}/>
            </CellHeader>
            <CellBody>
              关于衣家宝
            </CellBody>
            <CellFooter/>
          </Cell>
        </Cells>
      </Page>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    profile: selectUserInfo(state)
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Mine)