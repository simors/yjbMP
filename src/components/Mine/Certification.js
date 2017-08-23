/**
 * Created by wanpeng on 2017/8/17.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'

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
  }

  componentDidMount() {
    document.title = "实名认证"
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
              <Input type="text" placeholder="请输入"/>
            </CellBody>
          </FormCell>
          <FormCell>
            <CellHeader>
              <Label>身份证号</Label>
            </CellHeader>
            <CellBody>
              <Input type="text" placeholder="请输入"/>
            </CellBody>
          </FormCell>
        </Form>
        <div className="button">
          <Button onClick={() => {}}>提交</Button>
        </div>
      </Page>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

};

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Certification)