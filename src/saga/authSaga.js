/**
 * Created by wanpeng on 2017/8/14.
 */
import { call, put, takeEvery } from 'redux-saga/effects'
import {fetchWechatInfo, requestLeanSmsCode, verifySmsCode, register} from  '../api/auth'
import {requestWechatUserinfoSuccess} from '../actions/authActions'
import * as authActionTypes from '../constants/authActionTypes'

//获取微信用户信息
export function* fetchWechatUserinfoAction(action) {
  let payload = action.payload

  let userInfo = yield call(fetchWechatInfo, payload)
  yield put(requestWechatUserinfoSuccess({userInfo}))
}

//获取短信验证码
export function* requestSmsCode(action) {
  let payload = action.payload
  console.log("短信验证码请求：", payload)
  try {
    yield call(requestLeanSmsCode, payload)
    if(payload.success) {
      payload.success()
    }
  } catch(error) {
    if(payload.error) {
      payload.error()
    }
  }
}

//用户注册
export function* submitRegister(action) {
  let payload = action.payload
  console.log("提交注册请求：", payload)
  let verifyPayload = {
    phone: payload.phone,
    smsCode: payload.smsCode
  }
  try {
    let result = yield call(verifySmsCode, verifyPayload)
    if(!result) {
      if(payload.error) {
        payload.error("无效的短信验证码")
      }

    } else {
      yield call(register, payload)
      if(payload.success) {
        payload.success()
      }
    }
  } catch(error) {
    if(payload.error) {
      payload.error()
    }
  }
}

export const authSaga = [
  takeEvery(authActionTypes.FETCH_WECHAT_USERINFO, fetchWechatUserinfoAction),
  takeEvery(authActionTypes.REQUEST_SMSCODE, requestSmsCode),
  takeEvery(authActionTypes.SUBMIT_REGISTER, submitRegister)
]