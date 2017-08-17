/**
 * Created by wanpeng on 2017/8/11.
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

class OpenDevice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deviceid: undefined
    }
  }

  componentWillMount() {
    var deviceid = this.props.location.query.deviceid
    this.setState({
      deviceid: deviceid,
    })
  }

  render() {
    return(
      <Page>
        <div className="container">
          <img src="/logo.png" alt="" style={{display: `block`, width: `7.5rem`, height: `6.75rem`}}/>
        </div>
        <Panel style={{borderStyle: `solid`, borderWidth: 1, borderColor: `red`, marginTop: 0}}>
          <PanelHeader>
            {'设备编号：' + this.state.deviceid}
          </PanelHeader>
          <PanelBody>
            <MediaBox type="text">
              <MediaBoxTitle>13号柜门可使用</MediaBoxTitle>
              <MediaBoxDescription>
                请将衣物平整放入干衣柜，注意保持间隙。放置后请关门。
              </MediaBoxDescription>
            </MediaBox>
            <MediaBox type="text">
              <MediaBoxTitle>2元/小时</MediaBoxTitle>
              <MediaBoxDescription>
                计费标准
              </MediaBoxDescription>
            </MediaBox>

          </PanelBody>
        </Panel>
        <div className="button">
          <Button>开门</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(OpenDevice)