/**
 * Created by wanpeng on 2017/9/29.
 */
import {Map, List, Record} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import {OrderInfo, OrderInfoRecord, OrderState} from '../models/orderModel'
import * as orderActionTypes from '../constants/orderActionTypes'

const initialState = OrderState()

export default function orderReducer(state = initialState, action) {
  switch (action.type) {
    case orderActionTypes.FETCH_ORDERS_SUCCESS:
      return handleFetchOrders(state, action)
    case orderActionTypes.PAYMENT_ORDER_SUCCESS:
    case orderActionTypes.UPDATE_ORDER_SUCCESS:
      return handleUpdateOrder(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
      return
    default:
      return state
  }
}

function handleFetchOrders(state, action) {
  let ownsOrders = action.payload.ownsOrders
  let isRefresh = action.payload.isRefresh
  let myOrderList = List()
  if(!isRefresh) {
    myOrderList = state.get('myOrderList')
  }
  ownsOrders.forEach((order) => {
    let orderRecord = OrderInfo.fromLeancloudApi(order)
    state = state.setIn(['orders', order.id], orderRecord)
    myOrderList = myOrderList.push(order.id)
    state = state.set('myOrderList', myOrderList)
  })
  return state
}

function handleUpdateOrder(state, action) {
  let order = action.payload.order
  let orderRecord = OrderInfo.fromLeancloudApi(order)

  state = state.setIn(['orders', order.id], orderRecord)
  return state
}

function onRehydrate(state, action) {
  let incoming = action.payload.ORDER
  if (!incoming) return state

  let orders = incoming.orders
  if(orders) {
    let ordersMap = new Map(orders)
    try {
      for (let [orderId, order] of ordersMap) {
        if(orderId && order) {
          let orderRecord = OrderInfoRecord({...order})
          state = state.setIn(['orders', orderId], orderRecord)
        }
      }
    } catch (error) {
      ordersMap.clear()
    }
  }

  let myOrderList = incoming.myOrderList
  if(myOrderList) {
    let list = List(myOrderList)
    state = state.set('myOrderList', list)
  }
  return state
}