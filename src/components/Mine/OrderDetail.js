/**
 * Created by wanpeng on 2017/8/23.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {selectOrderById} from '../../selector/authSelector'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './orderDetail.css'
import {formatTime} from '../../util'
import {ORDER_STATUS_OCCUPIED, ORDER_STATUS_PAID, ORDER_STATUS_UNPAID} from '../../constants/appConfig'


const {
  Button,
  Page,
} = WeUI

class OrderDetail extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    document.title = "订单详细"
  }

  getAmount(order) {
    let duration = 0
    switch (order.status) {
      case ORDER_STATUS_PAID:
        return order.amount
        break
      case ORDER_STATUS_UNPAID:
        duration = ((order.endTime - order.createTime) * 0.001 / 60).toFixed(0)
        break
      case ORDER_STATUS_OCCUPIED:
        duration = ((Date.now() - order.createTime) * 0.001 / 60).toFixed(0)
        break
      default:
        break
    }
    return (duration * order.unitPrice).toFixed(2)
  }

  getDuration(createTime) {
    let duration = ((Date.now() - createTime) * 0.001 / 60).toFixed(0) //分钟
    return duration
  }

  render() {
    console.log("orderInfo", this.props.orderInfo)
    return(
      <Page style={{backgroundColor: `#EFEFF4`}}>
        <div className="item-area">
          <div className="order-detail-item">当前状态：正在烘干</div>
          <div className="order-detail-item">
            <div>{'订单编号：' + this.props.orderInfo.orderNo}</div>
            <div>{'下单时间：' + formatTime(this.props.orderInfo.createTime, 'YYYY/MM/DD HH:mm')}</div>
          </div>
          <div className="order-detail-item">
            <div>服务名称：普通干衣</div>
            <div>{'进行时长：' + this.getDuration(this.props.orderInfo.createTime) + '分钟'}</div>
            <div>所在柜门：13号</div>
          </div>
          <div className="order-detail-item">
            <div>{'衣柜编号：' + this.props.orderInfo.deviceNo}</div>
            <div>{'衣柜位置：' + this.props.orderInfo.deviceAddr}</div>
          </div>
          <div className="order-detail-item">
            {'实时计费：' + this.getAmount(this.props.orderInfo) + '元'}
          </div>
        </div>
        <div className="order-detail-buttom-area">
          <Button onClick={() => {}}>取出衣物</Button>
        </div>
      </Page>
    )
  }

}


const mapStateToProps = (state, ownProps) => {
  var orderId = ownProps.params.id
  return {
    orderInfo: selectOrderById(state, orderId)
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail)