/**
 * Created by wanpeng on 2017/8/11.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
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

  render() {
    return (
      <Page ptr={false}>
        <div className="container">
          <img src="/airbnb.svg" alt="" style={{display: `block`, width: `7.5rem`, height: `6.75rem`}}/>
        </div>

        <Cell access>
          <CellHeader>
            <img src="http://wx.qlogo.cn/mmopen/Ric56ibJEmQMY9d3xqXy0tlwRS4iaZkdttpMJghTGoKwq0mt04lcH3bV1gyJaQsuXia4X6aicdNTmaBy5YGauKLwyoMiaUSs3l3Com/0" alt="" style={{display: `block`, width: `3.13rem`, marginRight: `0.63rem`}}/>
          </CellHeader>
          <CellBody primary={true}>
            <h6>绿蚁网络</h6>
            <p>普通用户</p>
          </CellBody>
          <CellFooter>
            修改资料
          </CellFooter>
        </Cell>
        <Cells>
          <Cell href="javascript:;" access>
            <CellHeader>
              <img src="/wallet.svg" alt="" style={{display: `block`, width: `1rem`, marginRight: `1.06rem`}}/>
            </CellHeader>
            <CellBody>
              钱包
            </CellBody>
            <CellFooter/>
          </Cell>
          <Cell access>
            <CellHeader>
              <img src="/score.svg" alt="" style={{display: `block`, width: `1rem`, marginRight: `1.06rem`}}/>
            </CellHeader>
            <CellBody>
              积分
            </CellBody>
            <CellFooter/>
          </Cell>
          <Cell access>
            <CellHeader>
              <img src="/orders.svg" alt="" style={{display: `block`, width: `1rem`, marginRight: `1.06rem`}}/>
            </CellHeader>
            <CellBody>
              历史订单
            </CellBody>
            <CellFooter/>
          </Cell>
        </Cells>

        <Cells>
          <Cell access>
            <CellHeader>
              <img src="/about-us.svg" alt="" style={{display: `block`, width: `1rem`, marginRight: `1.06rem`}}/>
            </CellHeader>
            <CellBody>
              关于
            </CellBody>
            <CellFooter/>
          </Cell>
          <Cell access>
            <CellHeader>
              <img src="/link.svg" alt="" style={{display: `block`, width: `1rem`, marginRight: `1.06rem`}}/>
            </CellHeader>
            <CellBody>
              重新绑定微信账户
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
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Mine)