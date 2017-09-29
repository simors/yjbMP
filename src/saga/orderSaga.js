/**
 * Created by wanpeng on 2017/9/29.
 */
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import * as orderActionTypes from '../constants/orderActionTypes'
import {fetchOrdersApi, payOrderApi} from '../api/order'
import {fetchOrdersSuccess, paymentOrderSuccess, updateOrderSuccess} from '../actions/orderActions'
import {saveDevices, saveDevice} from '../actions/deviceActions'
import {saveStationsAction, saveStationAction} from '../actions/stationActions'

export function* fetchOrders(action) {
  let payload = action.payload

  let orderPayload = {
    limit: payload.limit,
    lastTurnOnTime: payload.lastTurnOnTime,
    isRefresh: payload.isRefresh,
  }

  try {
    let ownsOrders = yield call(fetchOrdersApi, orderPayload)
    yield put(fetchOrdersSuccess({ownsOrders: ownsOrders, isRefresh: payload.isRefresh}))
    let devices = new Set()
    let stations = new Set()
    ownsOrders.forEach((order) => {
      let device = order.device
      let station = device? device.station : undefined
      if(device) {
        devices.add(device)
      }
      if(station) {
        stations.add(station)
      }
    })
    if(devices.size > 0) {
      yield put(saveDevices({devices: devices}))
    }

    if(stations.size > 0) {
      yield put(saveStationsAction({stations: stations}))
    }
    if(payload.success) {
      payload.success(ownsOrders)
    }
  } catch(error) {
    if(payload.error) {
      payload.error(error)
    }
  }
}

export function* paymentOrder(action) {
  let payload = action.payload
  let paymentPayload = {
    userId: payload.userId,
    amount: payload.amount,
    orderId: payload.orderId,
    endTime: Date.now(),
  }

  try {
    let order = yield call(payOrderApi, paymentPayload)
    yield put(paymentOrderSuccess({order: order}))
    if(payload.success) {
      payload.success(order)
    }
  } catch(error) {
    if(payload.error) {
      payload.error(error)
    }
  }
}

export function* updateOrder(action) {
  let payload = action.payload
  let order = payload.order
  let device = order.device
  let station = device? device.station : undefined
  yield put(updateOrderSuccess({order: order}))
  if(device) {
    yield put(saveDevice({device: device}))
  }
  if(station) {
    yield put(saveStationAction({station: station}))
  }
}

export const orderSaga = [
  takeLatest(orderActionTypes.FETCH_ORDERS, fetchOrders),
  takeLatest(orderActionTypes.PAYMENT_ORDER, paymentOrder),
  takeLatest(orderActionTypes.UPDATE_ORDER, updateOrder)
]