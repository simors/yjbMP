/**
 * Created by wanpeng on 2017/8/18.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './score.css'

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

class Score extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    document.title = " 积分"
  }

  render() {
    console.log("this.props", this.props)
    return(
      <Page>
        <div className="background">
          <text className="score">3934</text>
          <text className="scoreTrip">当前积分</text>
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

export default connect(mapStateToProps, mapDispatchToProps)(Score)