/**
 * Created by wanpeng on 2017/8/16.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import WeUI from 'react-weui'
import './mine.css'

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

class Wallet extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    document.title = "消费明细"
  }

  render() {
    return(
      <Page>

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

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)