/**
 * Created by wanpeng on 2017/8/11.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as WECHAT_CONFIG from '../../constants/appConfig'
import WeUI from 'react-weui'
var OAuth = require('wechat-oauth');
var client = new OAuth(WECHAT_CONFIG.WECHAT_MP_APPID, WECHAT_CONFIG.WECHAT_MP_APPSECRET);

import './bindsuccess.css'

const {
  Page,
  Flex,
  FlexItem,
  Button,
  Msg,
  CellHeader,
  CellBody,
  CellFooter,
  Form,
  FormCell,
  Input,
  Label,
  Select,
} = WeUI

class BindSuccess extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    document.title = "绑定手机"
  }

  render() {
    return (
      <Page>
        <Flex className="flex" style={{flexDirection: 'column', justifyContent: 'space-around'}}>
          <FlexItem>
            <div className="placeholder">weui</div>
          </FlexItem>
          <FlexItem>
            <div className="placeholder">weui</div>
          </FlexItem>
          <FlexItem>
            <div className="placeholder">weui</div>
          </FlexItem>
          <FlexItem>
            <div className="placeholder">weui</div>
          </FlexItem>
        </Flex>
      </Page>
    )
  }

  // render() {
  //   return (
  //     <Page transition={true} infiniteLoader={true} ptr={false}>
  //       <div className="msg">
  //         <Msg
  //           type="success"
  //           title="绑定成功"
  //           buttons={[{
  //             type: 'primary',
  //             label: '返回',
  //             onClick: false
  //           }]}
  //         />
  //       </div>
  //       <div className="footer">
  //         <img className="logo" src="/airbnb.svg" alt=""/>
  //       </div>
  //     </Page>
  //   )
  // }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BindSuccess)