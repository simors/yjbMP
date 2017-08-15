/**
 * Created by wanpeng on 2017/8/14.
 */
import {Map, List} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import {AuthRecord} from '../models/authModel'
import * as authActionTypes from '../constants/authActionTypes'

const initialState = AuthRecord()

export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case authActionTypes.FETCH_WECHAT_USERINFO_SCCESS:
      return handleSaveWechatUserInfo(state, action)
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

function onRehydrate(state, action) {

  return state
}