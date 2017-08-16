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
    case authActionTypes.FETCH_WECHAT_USERINFO_SCCESS:
      return handleSaveWechatUserInfo(state, action)
    case authActionTypes.REGISTER_SUCCESS:
      return  handleSaveUserInfo(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleSaveWechatUserInfo(state, action) {
  let wechatUserInfo = action.payload.userInfo
  state = state.set('wechatUserInfo', wechatUserInfo)
  return state
}

function handleSaveUserInfo(state, action) {
  let userInfo = action.payload.userInfo
  state = state.set('profile', userInfo)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.AUTH
  if (!incoming) return state

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