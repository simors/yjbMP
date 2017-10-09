/**
 * Created by wanpeng on 2017/8/14.
 */
import {Map, List, Record} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import {AuthRecord, UserInfoRecord, UserInfo, WalletInfoRecord} from '../models/authModel'
import * as authActionTypes from '../constants/authActionTypes'

const initialState = AuthRecord()

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case authActionTypes.REGISTER_SUCCESS:
      return handleSaveUserInfo(state, action)
    case authActionTypes.LOGIN_SUCCESS:
      return handleSaveUserInfo(state, action)
    case authActionTypes.AUTO_LOGIN_SUCCESS:
      return handleAutoLogin(state, action)
    case authActionTypes.LOGIN_OUT:
      return handleLoginOut(state, action)
    case authActionTypes.FETCH_WALLET_INFO_SUCCESS:
      return handleSaveWalletInfo(state, action)
    case authActionTypes.FETCH_DEAL_RECORDS_SUCCESS:
      return handleFetchDealRecords(state, action)
    case authActionTypes.SAVE_IDNAME_INFO:
      return handleSaveIdNameInfo(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleSaveUserInfo(state, action) {
  let payload = action.payload
  let userId = payload.userInfo.get('id')
  state = state.set('profile', payload.userInfo)
  state = state.set('token', payload.token)
  state = state.set('activeUser', userId)
  return state
}

function handleAutoLogin(state, action) {
  let payload = action.payload
  let token = payload.token
  let user = payload.user
  let subscribe = payload.subscribe

  let userRecord = UserInfo.fromLeancloudObject(user)
  userRecord = userRecord.set('subscribe', subscribe)
  state = state.set('token', token)
  state = state.set('activeUser', user.id)
  state = state.set('profile', userRecord)

  return state
}

function handleSaveWalletInfo(state, action) {
  let walletInfo = action.payload

  let walletRecord = new WalletInfoRecord(walletInfo)
  state = state.set('wallet', walletRecord)
  return state
}

function handleSaveIdNameInfo(state, action) {
  let idInfo = action.payload

  state = state.setIn(['profile', 'idName'], idInfo.idName)
  state = state.setIn(['profile', 'idNumber'], idInfo.idNumber)
  state = state.setIn(['profile', 'idNameVerified'], idInfo.idNameVerified)
  return state
}

function handleLoginOut(state, action) {

  state = state.set('activeUser', undefined)
  state = state.set('token', undefined)
  state = state.set('profile', undefined)
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


  const wallet = incoming.wallet
  if(wallet) {
    var walletRecord = new WalletInfoRecord(wallet)
    state = state.set('wallet', walletRecord)
  }

  return state
}