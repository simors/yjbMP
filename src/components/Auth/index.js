/**
 * Created by wanpeng on 2017/8/9.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
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
} = WeUI

class Auth extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    document.title = "绑定手机"
  }

  render() {
    return (
      <Page ptr={false}>
        <div className="header">
          <img className="avatar" src="Starbucks.svg" alt=""/>
        </div>
        <div>
          <Form>
            <FormCell select selectPos="before">
              <CellHeader>
                <Select>
                  <option value="1">+86</option>
                  <option value="2">+80</option>
                  <option value="3">+84</option>
                  <option value="4">+87</option>
                </Select>
              </CellHeader>
              <CellBody>
                <Input type="tel" placeholder="请输入手机号码"/>
              </CellBody>
            </FormCell>
            <FormCell vcode>
              <CellHeader>
                <Label>验证码</Label>
              </CellHeader>
              <CellBody>
                <Input type="number" placeholder="请输入验证码"/>
              </CellBody>
              <CellFooter>
                <Button type="vcode">获取</Button>
              </CellFooter>
            </FormCell>
          </Form>
        </div>
        <div className="button">
          <Button>绑定</Button>
        </div>
        <div className="footer">
          <img className="logo" src="/airbnb.svg" alt=""/>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Auth)