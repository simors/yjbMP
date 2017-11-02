/**
 * Created by yangyang on 2017/6/28.
 */
import React, {Component} from 'react'
import {Link, IndexLink} from 'react-router'
import { Button, WhiteSpace, WingBlank } from 'antd-mobile';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'



class AppIndex extends Component {
  constructor(props) {
    super(props)
  }


  render() {
    return (
      <div style={{height: '100%'}}>
        <IndexLink to="/">主页</IndexLink>
        <WingBlank>
          <Button type="primary" >扫一扫</Button>
        </WingBlank>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(null, mapDispatchToProps)(AppIndex)