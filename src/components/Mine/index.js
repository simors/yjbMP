/**
 * Created by wanpeng on 2017/8/11.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import {selectActiveUserInfo} from '../../selector/authSelector'
import {fetchPromCategoryAction} from '../../actions/promotionActions'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './mine.css'
import Loading from '../../components/Loading'

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

  componentWillMount() {
    this.props.fetchPromCategoryAction({})
  }

  componentDidMount() {
    document.title = "个人中心"
  }

  render() {
    if(this.props.currentUser) {
      return (
        <Page ptr={false} style={{backgroundColor: `#EFEFF4`}}>
          <div className="container">
            <img src="/logo.png" alt="" style={{display: `block`, width: `7.5rem`, height: `6.75rem`}}/>
          </div>

          <Cells style={{marginTop: 0}}>
            <Cell access onClick={() => {browserHistory.push('/modifyProfile')}}>
              <CellHeader>
                <img src={this.props.currentUser.avatar || '/defaultAvatar.svg'} alt="" style={{display: `block`, width: `3.13rem`, marginRight: `0.63rem`}}/>
              </CellHeader>
              <CellBody primary={true}>
                <h6>{this.props.currentUser.nickname || '衣家宝'}</h6>
                <p style={{fontSize: `0.9rem`, marginTop: `0.1rem`}}>普通用户</p>
              </CellBody>
              <CellFooter style={{fontSize: `1.1rem`}}>
                修改资料
              </CellFooter>
            </Cell>
          </Cells>

          <Cells>
            <Cell access onClick={() => {browserHistory.push('/mine/score', {score: 100})}}>
              <CellHeader>
                <img src="/score.png" alt="" style={{display: `block`, width: `1.3rem`, marginRight: `1.1rem`}}/>
              </CellHeader>
              <CellBody>
                积分
              </CellBody>
              <CellFooter/>
            </Cell>
            <Cell access onClick={() => {browserHistory.push('/mine/wallet')}}>
              <CellHeader>
                <img src="/wallet.png" alt="" style={{display: `block`, width: `1.3rem`, marginRight: `1.1rem`}}/>
              </CellHeader>
              <CellBody>
                钱包
              </CellBody>
              <CellFooter/>
            </Cell>
            <Cell access onClick={() => {browserHistory.push('/mine/orders')}}>
              <CellHeader>
                <img src="/order.png" alt="" style={{display: `block`, width: `1.3rem`, marginRight: `1.1rem`}}/>
              </CellHeader>
              <CellBody>
                我的订单
              </CellBody>
              <CellFooter/>
            </Cell>
          </Cells>

          <Cells>
            <Cell access onClick={() => {browserHistory.push('/about')}}>
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
    } else {
      return (
        <Loading />
      )
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectActiveUserInfo(state)
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchPromCategoryAction,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Mine)