/**
 * Created by wanpeng on 2017/9/29.
 */
import {selectDeviceById} from './deviceSelector'
import {selectStationById} from './stationSelector'

export function selectOrderById(state, orderId) {
  if(!orderId) {
    return undefined
  }
  let orderRecord = state.ORDER.getIn(['orders', orderId])
  let order = orderRecord? orderRecord.toJS() : undefined
  let device =order? selectDeviceById(state, order.deviceId) : undefined
  let station =device? selectStationById(state, device.stationId) : undefined
  if(device) {
    order.deviceNo = device.deviceNo
    order.deviceAddr = device.deviceAddr
  }
  if(station) {
    order.unitPrice = station.unitPrice
  }
  return order
}

export function selectMyOrders(state) {
  let ORDER = state.ORDER
  let myOrderList = ORDER.get('myOrderList')
  let myOrders = []
  myOrderList.toArray().forEach((orderId) => {
    myOrders.push(selectOrderById(state, orderId))
  })
  return myOrders
}