/**
 * Created by wanpeng on 2017/8/14.
 */
import {Map, List, Record} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import {AuthRecord, UserInfoRecord} from '../models/authModel'
import * as authActionTypes from '../constants/authActionTypes'

const initialState = AuthRecord()

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case authActionTypes.FETCH_USERINFO_SCCESS:
      // return handleSaveWecUserInfo(state, action)
    case authActionTypes.REGISTER_SUCCESS:
      return handleSaveUserInfo(state, action)
    case authActionTypes.LOGIN_SUCCESS:
      return handleSaveUserInfo(state, action)
    case authActionTypes.LOGIN_OUT:
      return handleLoginOut(state, action)
    case authActionTypes.SAVE_ORDER_INFO:
      return handleSaveOrderInfo(state, action)
    case authActionTypes.FETCH_ORDERS_SUCCESS:
      return handleFetchOrders(state, action)
    case authActionTypes.PAYMENT_ORDER_SUCCESS:
      return handleUpdateOrderInfo(state, action)
    case authActionTypes.FETCH_WALLET_INFO_SUCCESS:
      return handleSaveWalletInfo(state, action)
    case authActionTypes.FETCH_DEAL_RECORDS_SUCCESS:
      return handleFetchDealRecords(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}
//
// function handleSaveWechatUserInfo(state, action) {
//   let wechatUserInfo = action.payload.userInfo
//   state = state.set('wechatUserInfo', wechatUserInfo)
//   return state
// }

function handleSaveUserInfo(state, action) {
  let payload = action.payload
  let userId = payload.userInfo.get('id')
  state = state.set('profile', payload.userInfo)
  state = state.set('token', payload.token)
  state = state.set('activeUser', userId)
  return state
}

function handleSaveWalletInfo(state, action) {
  let walletInfo = action.payload

  state = state.setIn(['profile', 'balance'], walletInfo.balance)
  state = state.setIn(['profile', 'deposit'], walletInfo.deposit)
  state = state.setIn(['profile', 'debt'], walletInfo.debt)

  return state
}

function handleLoginOut(state, action) {

  state = state.set('activeUser', undefined)
  state = state.set('token', undefined)
  state = state.set('profile', undefined)
  return state
}

function handleSaveOrderInfo(state, action) {
  let payload = action.payload
  let orderInfo = payload.order
  let orderId = orderInfo.id

  state = state.setIn(['orders', orderId], orderInfo)
  return state
}

function handleFetchOrders(state, action) {
  let payload = action.payload
  let orderRecordList = payload.orderRecordList
  orderRecordList.forEach((orderRecord) => {
    state = state.setIn(['orders', orderRecord.id], orderRecord)
  })
  return state
}

function handleFetchDealRecords(state, action) {
  let payload = action.payload
  let dealRecordList = payload.dealRecordList
  dealRecordList.forEach((dealRecord) => {
    state = state.setIn(['dealRecords', dealRecord.orderNo], dealRecord)
  })
  return state
}

function handleUpdateOrderInfo(state, action) {
  let payload = action.payload
  var orderRecord = payload.order

  state = state.setIn(['orders', orderRecord.id], orderRecord)
  return state
}


function onRehydrate(state, action) {

  var incoming = action.payload.AUTH
  if (!incoming) return state

  const token = incoming.token
  if(token) {
    state = state.set('token', token)
  }

  const activeUser = incoming.activeUser
  if(activeUser) {
    state = state.set('activeUser', activeUser)
  }

  const wechatUserInfo = incoming.wechatUserInfo
  if(wechatUserInfo) {
    state = state.set('wechatUserInfo', wechatUserInfo)
  }

  const profile = incoming.profile
  if(profile) {
    var profileRecord = new UserInfoRecord(profile)
    state = state.set('profile', profileRecord)
  }
  return state
}