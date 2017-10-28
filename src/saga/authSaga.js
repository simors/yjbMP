/**
 * Created by wanpeng on 2017/8/14.
 */
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import {setMobilePhoneAPi, requestLeanSmsCode, become, getPaymentCharge, getTransfer, getWalletInfo, getDealRecords, verifyIdName, getJssdkConfig, loginAuthData, updateUserRegionApi} from  '../api/auth'
import {saveUser, loginSuccess, autoLoginSuccess, logout, fetchOrdersSuccess, paymentOrderSuccess, fetchWalletInfoSuccess, fetchDealRecordsSuccess, saveIdNameInfo, updateOrderSuccess} from '../actions/authActions'
import * as authActionTypes from '../constants/authActionTypes'


//获取短信验证码
export function* requestSmsCode(action) {
  let payload = action.payload
  console.log("短信验证码请求：", payload)
  try {
    let result = yield call(requestLeanSmsCode, payload)
    console.log("requestLeanSmsCode result:", result)
    if(payload.success) {
      payload.success()
    }
  } catch(error) {
    console.log("error: ", error)
    if(payload.error) {
      payload.error()
    }
  }
}

export function* setMobilePhone(action) {
  let payload = action.payload
  let userPayload = {
    phone: payload.phone,
    smsCode: payload.smsCode
  }

  try {
    let user = yield call(setMobilePhoneAPi, userPayload)
    yield put(saveUser({user: user}))
    if(payload.success) {
      payload.success()
    }
  } catch (error) {
    console.error(error)
    if(payload.error) {
      payload.error(error)
    }
  }
}

//自动登录
export function* autoLogin(action) {
  let payload = action.payload
  try {
    let result = yield call(become, payload)
    let token = result.token
    let user = result.user
    let subscribe = result.subscribe
    let mobilePhoneVerified = user.attributes.mobilePhoneVerified
    yield put(autoLoginSuccess({token: token, user: user, subscribe: subscribe}))
    console.log("自动登录成功：", user)
    yield call(updateUserRegionApi, {})
    if (payload.success) {
      payload.success(mobilePhoneVerified)
    }
  } catch(error) {
    console.log("自动登录失败：", error)
    yield put(logout({}))
  }

}

//通过微信authData登录
export function* wechatAuthDataLogin(action) {
  let payload = action.payload

  let authPayload = {
    openid: payload.openid,
    access_token: payload.access_token,
    expires_at: payload.expires_at
  }

  try {
    let result = yield call(loginAuthData, authPayload)
    let userInfo = result.userInfo
    let token = result.token
    let mobilePhoneNumber = userInfo.attributes.mobilePhoneNumber
    yield put(loginSuccess({userInfo: userInfo, token: token}))
    yield call(updateUserRegionApi, {})
    if (payload.success) {
      payload.success(mobilePhoneNumber)
    }
  } catch (error) {
    console.error("微信authData登录失败：", error)
    yield put(logout({}))
  }
}

//创建ping++支付对象
export function* createPayment(action) {
  let payload = action.payload

  let paymentPayload = {
    amount: payload.amount,
    channel: payload.channel,
    metadata: payload.metadata,
    openid: payload.openid,
    subject: payload.subject
  }

  try {
    let charge = yield call(getPaymentCharge, paymentPayload)
    if(payload.success) {
      payload.success(charge)
    }

  } catch(error) {
    if(payload.error) {
      payload.error(error)
    }
  }
}

export function* createTransfer(action) {
  let payload = action.payload

  let transferPayload = {
    amount: payload.amount,
    channel: payload.channel,
    metadata: payload.metadata,
    openid: payload.openid,
    username: payload.username,
  }

  try {
    let transfer = yield call(getTransfer, transferPayload)
    if(payload.success) {
      payload.success(transfer)
    }

  } catch(error) {
    if(payload.error) {
      payload.error(error)
    }
  }
}

export function* fetchWalletInfo(action) {
  let payload = action.payload

  try {
    let walletInfo = yield call(getWalletInfo, {userId: payload.userId})
    if(walletInfo) {
      yield put(fetchWalletInfoSuccess(walletInfo))
    }
    if(payload.success) {
      payload.success()
    }
  } catch(error) {
    if(payload.error) {
      payload.error(error)
    }
  }

}

export function* fetchDealRecords(action) {
  let payload = action.payload
  let dealPayload = {
    userId: payload.userId
  }
  try {
    let dealRecordList = yield call(getDealRecords, dealPayload)
    if(dealRecordList.length > 0) {
      yield put(fetchDealRecordsSuccess({dealRecordList}))
    }
    if(payload.success) {
      payload.success(dealRecordList)
    }
  } catch(error) {
    if(payload.error) {
      payload.error(error)
    }
  }
}

export function* requestVerifyIdName(action) {
  let payload = action.payload
  let verifyPayload = {
    userId: payload.userId,
    idName: payload.idName,
    idNumber: payload.idNumber
  }
  try {
    let idInfo = yield call(verifyIdName, verifyPayload)
    yield put(saveIdNameInfo(idInfo))
    if(payload.success) {
      payload.success(idInfo)
    }
  } catch(error) {
    if(payload.error) {
      payload.error(error)
    }
  }
}

export function* fetchJssdkConfig(action) {
  let payload = action.payload

  let jsConfigPayload = {
    debug: payload.debug,
    jsApiList: payload.jsApiList,
    url: payload.url,
  }

  try {
    let configInfo = yield call(getJssdkConfig, jsConfigPayload)
    if(configInfo && payload.success) {
      payload.success(configInfo)
    }
  } catch(error) {
    if(payload.error) {
      payload.error(error)
    }
  }
}

export const authSaga = [
  takeLatest(authActionTypes.REQUEST_SMSCODE, requestSmsCode),
  takeLatest(authActionTypes.AUTO_LOGIN, autoLogin),
  takeLatest(authActionTypes.CREATE_PAYMENT, createPayment),
  takeLatest(authActionTypes.CREATE_TRANSFER, createTransfer),
  takeLatest(authActionTypes.FETCH_WALLET_INFO, fetchWalletInfo),
  takeLatest(authActionTypes.FETCH_DEAL_RECORDS, fetchDealRecords),
  takeLatest(authActionTypes.REQUEST_VERIFY_IDNAME, requestVerifyIdName),
  takeLatest(authActionTypes.FETCH_WECHAT_JSSDK_CONFIG, fetchJssdkConfig),
  takeLatest(authActionTypes.LOGIN_WITH_WECHAT_AUTHDATA, wechatAuthDataLogin),
  takeLatest(authActionTypes.SET_MOBILE_PHONE, setMobilePhone),
]