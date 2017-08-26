/**
 * Created by wanpeng on 2017/8/23.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'

const {
  Button,
  Panel,
  Page,
  PanelHeader,
  PanelBody,
  PanelFooter,
  MediaBox,
  MediaBoxTitle,
  MediaBoxDescription,
  Tab,
  NavBar,
  NavBarItem,
  TabBody,
  InfiniteLoader,
  Cells,
  Cell,
  CellHeader,
  CellBody,
  CellMore,
  CellFooter,
} = WeUI

class OrderDetail extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    document.title = "订单详细"
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail)