/**
 * Created by yangyang on 2017/6/28.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import { fetchWechatJssdkConfig} from '../../actions/authActions'

const {
  Button,
  Panel,
  Page,
  PanelHeader,
  PanelBody,
  MediaBox,
  MediaBoxTitle,
  MediaBoxDescription,
} = WeUI

import RedEnvelope from '../Promotion/RedEnvelope'


class About extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
  }


  componentDidMount() {
    document.title = "衣家宝"
  }

  render() {
    console.log("this.props", this.props)
    return (
      <div>
        <RedEnvelope />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchWechatJssdkConfig
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(About)