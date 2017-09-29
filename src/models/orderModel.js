/**
 * Created by wanpeng on 2017/9/29.
 */
import {Map, List, Record} from 'immutable'

export const OrderInfoRecord = Record({
  id: undefined,            //订单id
  orderNo: undefined,       //订单编号
  status: undefined,        //订单状态
  createTime: undefined,    //下单时间
  endTime: undefined,       //结单时间
  deviceId: undefined,      //设备id
  amount: undefined,        //服务费用
  userId: undefined,        //用户id
}, 'OrderInfoRecord')

export class OrderInfo extends OrderInfoRecord {
  static fromLeancloudApi(obj) {
    let info = new OrderInfoRecord()

    return info.withMutations((record) => {
      record.set('id', obj.id)
      record.set('orderNo', obj.orderNo)
      record.set('status', obj.status)
      record.set('createTime', obj.createTime)
      record.set('endTime', obj.endTime)
      record.set('deviceId', obj.deviceId)
      record.set('amount', obj.amount || 0)
      record.set('userId', obj.userId)
    })
  }
}

export const OrderState = Record({
  orders: Map(),              //订单信息 健为orderId，值为OrderInfoRecord
  myOrderList: List(),        //我的订单列表
}, 'OrderState')