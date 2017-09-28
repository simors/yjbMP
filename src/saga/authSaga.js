/**
 * Created by wanpeng on 2017/8/14.
 */
import { call, put, takeEvery } from 'redux-saga/effects'
import {fetchUserInfo, requestLeanSmsCode, register, become, login, getPaymentCharge, fetchOrdersApi, getTransfer, payOrder, getWalletInfo, getDealRecords, verifyIdName, getJssdkConfig} from  '../api/auth'
import {registerSuccess, loginSuccess, loginOut, fetchOrdersSuccess, paymentOrderSuccess, fetchWalletInfoSuccess, fetchDealRecordsSuccess, saveIdNameInfo, updateOrderSuccess} from '../actions/authActions'
import * as authActionTypes from '../constants/authActionTypes'
import {saveDevice} from '../actions/deviceActions'
import {saveStationAction} from '../actions/stationActions'

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

export function* fetchOrders(action) {
  let payload = action.payload

  let orderPayload = {
    limit: payload.limit,
    lastTurnOnTime: payload.lastTurnOnTime,
    isRefresh: payload.isRefresh,
  }

  try {
    let orderList = yield call(fetchOrdersApi, orderPayload)
    if(payload.success) {
      payload.success(orderList)
    }
    yield put(fetchOrdersSuccess({ orderList }))
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

export function* paymentOrder(action) {
  let payload = action.payload
  let paymentPayload = {
    userId: payload.userId,
    amount: payload.amount,
    orderId: payload.orderId,
    endTime: Date.now(),
  }

  try {
    let order = yield call(payOrder, paymentPayload)
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

export function* fetchWalletInfo(action) {
  let payload = action.payload

  let walletPayload = {
    userId: payload.userId
  }
  try {
    let walletInfo = yield call(getWalletInfo, walletPayload)
    if(walletInfo) {
      yield put(fetchWalletInfoSuccess(walletInfo))
    }
    if(payload.success) {
      payload.success(walletInfo)
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
    console.log("fetchDealRecords records:", dealRecordList)
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
  takeEvery(authActionTypes.FETCH_USERINFO, fetchUserinfoAction),
  takeEvery(authActionTypes.REQUEST_SMSCODE, requestSmsCode),
  takeEvery(authActionTypes.SUBMIT_REGISTER, submitRegister),
  takeEvery(authActionTypes.AUTO_LOGIN, autoLogin),
  takeEvery(authActionTypes.CREATE_PAYMENT, createPayment),
  takeEvery(authActionTypes.FETCH_ORDERS, fetchOrders),
  takeEvery(authActionTypes.CREATE_TRANSFER, createTransfer),
  takeEvery(authActionTypes.PAYMENT_ORDER, paymentOrder),
  takeEvery(authActionTypes.FETCH_WALLET_INFO, fetchWalletInfo),
  takeEvery(authActionTypes.FETCH_DEAL_RECORDS, fetchDealRecords),
  takeEvery(authActionTypes.REQUEST_VERIFY_IDNAME, requestVerifyIdName),
  takeEvery(authActionTypes.FETCH_WECHAT_JSSDK_CONFIG, fetchJssdkConfig),
  takeEvery(authActionTypes.UPDATE_ORDER, updateOrder),
]