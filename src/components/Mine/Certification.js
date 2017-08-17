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

      </Page>
    )
  }
}

const mapStateToProps = (state, ownProps) => {

};

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Certification)