/**
 * Created by wanpeng on 2017/8/11.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
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
} = WeUI

class ModifyProfile extends  Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    document.title = "修改资料"
  }

  render() {
    return(
      <Page>
        <Cells>
          <Cell access>
            <CellBody>
              头像
            </CellBody>
            <CellFooter>
              <img src="http://wx.qlogo.cn/mmopen/Ric56ibJEmQMY9d3xqXy0tlwRS4iaZkdttpMJghTGoKwq0mt04lcH3bV1gyJaQsuXia4X6aicdNTmaBy5YGauKLwyoMiaUSs3l3Com/0" alt="" style={{display: `block`, width: `3.13rem`, marginRight: `0.63rem`}}/>
            </CellFooter>
          </Cell>
        </Cells>
        <Cells>
          <Cell access>
            <CellBody>
              昵称
            </CellBody>
            <CellFooter>
              绿蚁网络
            </CellFooter>
          </Cell>
          <Cell access>
            <CellBody>
              姓名
            </CellBody>
            <CellFooter>
              绿蚁网络
            </CellFooter>
          </Cell>
          <Cell access>
            <CellBody>
              实名认证
            </CellBody>
            <CellFooter>
              已认证
            </CellFooter>
          </Cell>
          <Cell>
            <CellBody>
              手机号码
            </CellBody>
            <CellFooter>
              13888888888
            </CellFooter>
          </Cell>
          <Cell>
            <CellBody>
              微信号
            </CellBody>
            <CellFooter>
              7gdf837e24iu3254iuy
            </CellFooter>
          </Cell>

        </Cells>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModifyProfile)