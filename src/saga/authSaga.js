/**
 * Created by wanpeng on 2017/8/14.
 */
import { call, put, takeEvery } from 'redux-saga/effects'
import {fetchUserInfo, requestLeanSmsCode, register, become, login} from  '../api/auth'
import {requestUserinfoSuccess, registerSuccess, loginSuccess, loginOut} from '../actions/authActions'
import * as authActionTypes from '../constants/authActionTypes'

//获取微信用户信息
export function* fetchUserinfoAction(action) {
  let payload = action.payload

  try {
    let userInfo = yield call(fetchUserInfo, {code: payload.code})
    let isBind = userInfo.isBind
    if(isBind) {
      let loginPayload = {
        openid: userInfo.openid,
        accessToken: userInfo.accessToken,
        expires_in: userInfo.expires_in
      }
      yield call(wechatLogin, {payload: loginPayload})
    }
    if(payload.success) {
      payload.success(userInfo)
    }
  } catch(error) {
    if(payload.error) {
      payload.error(error)
    }
  }
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
    let result = yield call(register, payload)
    yield  put(registerSuccess({userInfo: result.userInfo, token: result.token}))
    if(payload.success) {
      payload.success()
    }
  } catch(error) {
    if(payload.error) {
      payload.error()
    }
  }
}

//自动登录
export function* autoLogin(action) {
  let payload = action.payload
  try {
    let result = yield call(become, payload)
    let token = result.token
    let userInfo = result.userInfo
    yield put(loginSuccess({token: token, userInfo: userInfo}))
    console.log("自动登录成功：", userInfo)
  } catch(error) {
    console.log("自动登录失败：", error)
    yield put(loginOut({}))
  }

}

//微信登录
export function* wechatLogin(action) {
  let payload = action.payload

  try {
    let result = yield call(login, payload)
    let token = result.token
    let userInfo = result.userInfo
    yield put(loginSuccess({token: token, userInfo: userInfo}))
    console.log("微信登录成功：", userInfo)
  } catch(error) {
    console.log("微信登录失败：", error)
    yield put(loginOut({}))
  }
}

export const authSaga = [
  takeEvery(authActionTypes.FETCH_USERINFO, fetchUserinfoAction),
  takeEvery(authActionTypes.REQUEST_SMSCODE, requestSmsCode),
  takeEvery(authActionTypes.SUBMIT_REGISTER, submitRegister),
  takeEvery(authActionTypes.AUTO_LOGIN, autoLogin),
  takeEvery(authActionTypes.LOGIN, wechatLogin)
]