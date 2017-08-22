/**
 * Created by wanpeng on 2017/8/9.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'
import {requestUserinfo, requestSmsCode, submitRegister} from '../../actions/authActions'
import {selectWechatUserInfo} from '../../selector/authSelector'
import WeUI from 'react-weui'
import './auth.css'

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

class Auth extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    document.title = "授权"
  }

  componentWillMount() {

    console.log("props", this.props)
    var code = this.props.location.query.code
    if(code) {
      this.props.requestUserinfo({code: code})
    }
  }

  render() {
    return(
      <Page>
        <Button>授权页面</Button>
      </Page>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  requestUserinfo
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Auth)