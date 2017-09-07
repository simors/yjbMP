/**
 * Created by wanpeng on 2017/8/14.
 */
import * as appConfig from '../constants/appConfig'

export function selectWechatUserInfo(state) {
  let AUTH = state.AUTH
  return AUTH.wechatUserInfo
}

export function selectUserInfo(state) {
  let AUTH = state.AUTH
  return AUTH.profile.toJS()
}

export function isUserLogined(state) {
  let AUTH = state.AUTH
  let activeUser = AUTH.activeUser
  return activeUser ? true : false
}

export function selectToken(state) {
  let AUTH = state.AUTH
  return AUTH.token
}

export function selectUnpaidOrders(state) {
  let AUTH = state.AUTH
  let ordersMap = AUTH.orders
  let unpaidOrderList = []
  let unpaidOrderMap = ordersMap.filter((order) => {
    return order.status === appConfig.ORDER_STATUS_UNPAID
  })
  unpaidOrderMap.toArray().forEach((orderRecord) => {
    unpaidOrderList.push(orderRecord.toJS())
  })
  return unpaidOrderList
}

export function selectPaidOrders(state) {
  let AUTH = state.AUTH
  let ordersMap = AUTH.orders
  let paidOrderList = []
  let paidOrderMap = ordersMap.filter((order) => {
    return order.status === appConfig.ORDER_STATUS_PAID
  })
  paidOrderMap.toArray().forEach((orderRecord) => {
    paidOrderList.push(orderRecord.toJS())
  })
  return paidOrderList
}

export function selectOccupiedOrders(state) {
  let AUTH = state.AUTH
  let ordersMap = AUTH.orders
  let occupiedOrderList = []
  let occupiedOrdersMap = ordersMap.filter((order) => {
    return order.status === appConfig.ORDER_STATUS_OCCUPIED
  })
  occupiedOrdersMap.toArray().forEach((orderRecord) => {
    occupiedOrderList.push(orderRecord.toJS())
  })
  return occupiedOrderList
}

export function selectOrderById(state, orderId) {
  let AUTH = state.AUTH
  let orderRecord = AUTH.getIn(['orders', orderId])

  return orderRecord? orderRecord.toJS() : undefined
}

export function selectDealRecord(state) {
  let AUTH = state.AUTH
  let dealRecordsMap = AUTH.dealRecords
  let dealRecordList = []
  dealRecordsMap.toArray().forEach((dealRecord) => {
    dealRecordList.push(dealRecord.toJS())
  })
  return dealRecordList
}