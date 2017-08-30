/**
 * Created by wanpeng on 2017/8/14.
 */
import { call, put, takeEvery } from 'redux-saga/effects'
import {fetchUserInfo, requestLeanSmsCode, register, become, login, getPaymentCharge, fetchOrderByStatus} from  '../api/auth'
import {registerSuccess, loginSuccess, loginOut, saveOrderInfo, fetchOrdersSuccess} from '../actions/authActions'
import * as authActionTypes from '../constants/authActionTypes'
import {OrderInfo} from '../models/authModel'

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

export function* fetchOrderInfo(action) {
  let payload = action.payload
  let orderInfo = payload.orderInfo
  let orderRecord = OrderInfo.fromLeancloudApi(orderInfo)

  try {
    yield put(saveOrderInfo({orderRecord}))
    if(payload.success) {
      payload.success()
    }
  } catch(error) {
    if(payload.error) {
      payload.error(error)
    }
  }
}

export function* fetchOrders(action) {
  let payload = action.payload

  try {
    let orders = yield call(fetchOrderByStatus, payload)
    console.log("fetchOrders", orders)
    let orderRecordList = []
    orders.forEach((orderInfo) => {
      orderRecordList.push(OrderInfo.fromLeancloudApi(orderInfo))
    })
    yield put(fetchOrdersSuccess({orderRecordList}))
    if(payload.success) {
      payload.success(orders)
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
  takeEvery(authActionTypes.LOGIN, wechatLogin),
  takeEvery(authActionTypes.CREATE_PAYMENT, createPayment),
  takeEvery(authActionTypes.FETCH_ORDER_INFO, fetchOrderInfo),
  takeEvery(authActionTypes.FETCH_ORDERS, fetchOrders)
]