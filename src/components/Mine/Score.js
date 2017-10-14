/**
 * Created by wanpeng on 2017/8/18.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import WeUI from 'react-weui'
import {selectActiveUserInfo} from '../../selector/authSelector'

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
  InfiniteLoader,
  Cells,
  Cell,
  CellBody,
  CellFooter,
  CellsTitle,
} = WeUI

class Score extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    document.title = " 积分"
  }

  onLoadMoreRecord = (resolve, finish) => {
    console.log("获取更多积分记录！")
    setTimeout(function () {
      resolve()
    }, 1000)
  }

  render() {
    return(
    <InfiniteLoader onLoadMore={this.onLoadMoreRecord}>
      <Page ptr={false}>
        <div className="background">
          <text className="score">3934</text>
          <text className="scoreTrip">当前积分</text>
        </div>
        <Cells>
          {
            this.props.scoreRecords.map((item, i) => {
              return(
                <Cell key={i} access onClick={() => {}}>
                  <CellBody>
                    <div className="record">
                      <div className="record-header">
                        <text className="content-primary">{item.title}</text>
                        <text className="content-trip">{item.time}</text>
                      </div>
                      <div className="record-content">
                        <text className="content-primary">{item.score}</text>
                        <text className="content-trip">{item.trip}</text>
                      </div>
                    </div>
                  </CellBody>
                </Cell>
              )
            })
          }
        </Cells>
      </Page>
    </InfiniteLoader>
    )
  }


}


const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectActiveUserInfo(state),
    scoreRecords: [{title: '付款成功－干衣', time: '2017-03-30', trip: '消费5.00元', score: 50}],
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Score)