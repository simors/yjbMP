/**
 * Created by wanpeng on 2017/8/14.
 */
import {Map, List, Record} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import {AuthState, UserInfoRecord, UserInfo, WalletInfoRecord, Deal, DealRecord} from '../models/authModel'
import * as authActionTypes from '../constants/authActionTypes'

const initialState = AuthState()

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case authActionTypes.LOGIN_SUCCESS:
      return handleLoginSuccess(state, action)
    case authActionTypes.AUTO_LOGIN_SUCCESS:
      return handleAutoLogin(state, action)
    case authActionTypes.LOGOUT:
      return handleLoginOut(state, action)
    case authActionTypes.FETCH_WALLET_INFO_SUCCESS:
      return handleSaveWalletInfo(state, action)
    case authActionTypes.FETCH_DEAL_RECORDS_SUCCESS:
      return handleFetchDealRecords(state, action)
    case authActionTypes.SAVE_IDNAME_INFO:
      return handleSaveIdNameInfo(state, action)
    case authActionTypes.SAVE_USER:
      return handleSaveUser(state, action)
    case authActionTypes.SAVE_USERS:
      return handleSaveUsers(state, action)
    case authActionTypes.UPDATE_IS_REQUEST_REFUND:
      return handleUpdateIsRequestRefund(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleSaveUser(state, action) {
  let user = action.payload.user
  if(!user) {
    return state
  }
  let userRecord = UserInfo.fromApi(user)
  state = state.setIn(['profiles', user.id], userRecord)
  return state
}

function handleSaveUsers(state, action) {
  let users = action.payload.users
  if(!users) {
    return state
  }
  users.forEach((user) => {
    let userRecord = UserInfo.fromApi(user)
    state = state.setIn(['profiles', user.id], userRecord)
  })
  return state
}

function handleLoginSuccess(state, action) {
  let userInfo = action.payload.userInfo
  let token = action.payload.token
  let userInfoRecord = UserInfo.fromLeancloudObject(userInfo)
  state = state.set('activeUser', userInfo.id)
  state = state.set('token', token)
  state = state.setIn(['profiles', userInfo.id], userInfoRecord)
  return state
}

function handleAutoLogin(state, action) {
  let payload = action.payload
  let token = payload.token
  let user = payload.user

  let userRecord = UserInfo.fromLeancloudObject(user)
  state = state.set('token', token)
  state = state.set('activeUser', user.id)
  state = state.setIn(['profiles', user.id], userRecord)

  return state
}

function handleSaveWalletInfo(state, action) {
  let walletInfo = action.payload

  let walletRecord =walletInfo? new WalletInfoRecord(walletInfo): undefined
  state = state.set('wallet', walletRecord)
  return state
}

function handleSaveIdNameInfo(state, action) {
  // let idInfo = action.payload
  // let activeUser = state.get('activeUser')
  // let profileMap = state.get('profiles')
  // if(!activeUser || !profileMap) {
  //   return state
  // }
  // profileMap = profileMap.setIn([activeUser, 'idName'], idInfo.idName)
  // profileMap = profileMap.setIn([activeUser, 'idNumber'], idInfo.idNumber)
  // profileMap = profileMap.setIn([activeUser, 'idNameVerified'], idInfo.idNameVerified)
  //
  // state = state.set('profiles', profileMap)
  return state
}

function handleLoginOut(state, action) {

  state = state.set('activeUser', undefined)
  state = state.set('token', undefined)
  state = state.set('profiles', undefined)
  return state
}

function handleFetchDealRecords(state, action) {
  let deals = action.payload.deals
  let isRefresh = action.payload.isRefresh
  let dealList = List()
  if(!isRefresh) {
    dealList = state.get("dealList")
  }
  deals.forEach((deal) => {
    let dealRecord = Deal.fromJSON(deal)
    state = state.setIn(['dealRecords', deal.id], dealRecord)
    dealList = dealList.push(deal.id)
  })
  state = state.set('dealList', dealList)
  return state
}

function handleUpdateIsRequestRefund(state, action) {
  let payload = action.payload
  let isRefunding = payload.isRefunding
  state = state.set('isRequestRefund', isRefunding)
  return state
}


function onRehydrate(state, action) {

  var incoming = action.payload.AUTH
  if (!incoming) return state

  const token = incoming.token
  if(token) {
    state = state.set('token', token)
  }

  let profileMap = new Map(incoming.profiles)
  try {
    for (let [userId, user] of profileMap) {
      if(userId && user) {
        let userRecord = new UserInfoRecord({...user})
        state = state.setIn(['profiles', userId], userRecord)
      }
    }
  } catch (error) {
    profileMap.clear()
  }

  const wallet = incoming.wallet
  if(wallet) {
    var walletRecord = new WalletInfoRecord(wallet)
    state = state.set('wallet', walletRecord)
  }

  const dealList = incoming.dealList
  if(dealList) {
    state = state.set('dealList', List(dealList))
  }

  let dealRecordsMap = new Map(incoming.dealRecords)
  try {
    for (let [dealId, deal] of dealRecordsMap) {
      if(dealId && deal) {
        let dealRecord = new DealRecord({...deal})
        state = state.setIn(['dealRecords', dealId], dealRecord)
      }
    }
  } catch (error) {
    dealRecordsMap.clear()
  }

  return state
}