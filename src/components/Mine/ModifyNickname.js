/**
 * Created by wanpeng on 2017/8/17.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {browserHistory} from 'react-router'

import WeUI from 'react-weui'

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
  Label,
  Input
} = WeUI

class ModifyNickname extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <Page style={{backgroundColor: `#EFEFF4`}}>
        <Form>
          <FormCell>
            <CellHeader>
              <Label>昵称</Label>
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
  return {
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ModifyNickname)