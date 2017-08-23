/**
 * Created by wanpeng on 2017/8/18.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './wallet-detail.css'

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

class WalletDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [...Array(20).keys()],
      records: [{title: '付款成功－充值', date: '2017-03-30 14:23', amount: 50, type: '平台充值'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
        {title: '付款成功－干衣', date: '2017-03-30 15:30', amount: 8, type: '干衣消费'},
      ]
    }
  }

  componentDidMount() {
    document.title = "消费明细"
  }

  onLoadMoreRecord = (resolve, finish) => {
    console.log("获取更多消费记录！")
    setTimeout(function () {
      resolve()
    }, 1000)
  }

  showRecordDetail(record) {

  }


  render(){
    return (
    <InfiniteLoader onLoadMore={this.onLoadMoreRecord}>
      <Page ptr={false}>
        <Cells>
          {
            this.state.records.map( (item, i) => {
              return (
                <Cell key={i} access onClick={() => {this.showRecordDetail(item)}}>
                  <CellBody>
                    <div className="record">
                      <div className="record-header">
                        <text className="content-primary">{item.title}</text>
                        <text className="content-trip">{item.date}</text>
                      </div>
                      <div className="record-content">
                        <text className="content-primary">{item.amount}</text>
                        <text className="content-trip">{item.type}</text>
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

  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(WalletDetail)