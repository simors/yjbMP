/**
 * Created by wanpeng on 2017/8/14.
 */
import {ORDER_STATUS_OCCUPIED, ORDER_STATUS_PAID, ORDER_STATUS_UNPAID} from '../constants/appConfig'

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
  let unpaidOrders = ordersMap.filter((order) => {
    return order.status === ORDER_STATUS_UNPAID
  })

  return unpaidOrders.toJS()
}

export function selectPaidOrders(state) {
  let AUTH = state.AUTH
  let ordersMap = AUTH.orders

  let paidOrders = ordersMap.filter((order) => {
    return order.status === ORDER_STATUS_PAID
  })
  return paidOrders.toJS()
}

export function selectOccupiedOrders(state) {
  let AUTH = state.AUTH
  let ordersMap = AUTH.orders

  let occupiedOrders = ordersMap.filter((order) => {
    return order.status === ORDER_STATUS_OCCUPIED
  })
  return occupiedOrders.toJS()
}