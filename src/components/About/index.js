/**
 * Created by yangyang on 2017/6/28.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {requestDomain} from '../../actions/configActions'
import {selectDomain} from '../../selector/configSelector'
import WeUI from 'react-weui'

import 'weui'
// import 'react-weui/lib/react-weui.min.css'

const {Button} = WeUI

class About extends Component {
  constructor(props) {
    super(props)
  }

  getDomain = () => {
    this.props.requestDomain({times: 1})
  }

  render() {
    return (
      <div>
        <Button onClick={this.getDomain}>获取域名</Button>
        <div>
          {this.props.domain ? this.props.domain : ""}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    domain: selectDomain(state)
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  requestDomain,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(About)