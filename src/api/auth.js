/**
 * Created by wanpeng on 2017/8/14.
 */
import AV from 'leancloud-storage'
import {APP_NAME} from '../constants/appConfig'
import {UserInfo, OrderInfo} from '../models/authModel'

export function become(payload) {
  return AV.User.become(payload.token).then((leanUser) => {
    let userInfo = UserInfo.fromLeancloudObject(leanUser)
    let token = leanUser.getSessionToken()

    return ({
      token: token,
      userInfo: userInfo,
    })
  }, (err) => {
    throw err
  })
}

export function fetchUserInfo(payload) {
  var params = {
    code: payload.code
  }
  return AV.Cloud.run('authFetchUserInfo', params).then((userInfo) => {
    return userInfo
  }).catch((error) => {
    console.log("获取微信用户信息失败：", error)
    throw error
  })
}

export function requestLeanSmsCode(payload) {
  let phone = payload.phone
  return AV.Cloud.requestSmsCode({
    mobilePhoneNumber:phone,
    name: APP_NAME,
    op: '绑定手机',
    ttl: 10}).then(function () {
    // do nothing
  }, function (err) {
    // err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    console.log("requestSmsCode error:", err)
    throw err
  })
}

export function register(payload) {
  console.log("register", payload)
  let authData = {
    "openid": payload.wechatUserInfo.openid,
    "access_token": payload.wechatUserInfo.accessToken,
    "expires_at": Date.parse(payload.wechatUserInfo.expires_in),
  }
  let platform = 'weixin'

  return AV.User.signUpOrlogInWithMobilePhone(payload.phone, payload.smsCode).then((user) => {
    return AV.User.associateWithAuthData(user, platform, authData)
  }).then((authUser) => {
    authUser.set('nickname', payload.wechatUserInfo.nickname)
    authUser.set('avatar', payload.wechatUserInfo.headimgurl)
    authUser.set('sex', payload.wechatUserInfo.sex)
    authUser.set('language', payload.wechatUserInfo.language)
    authUser.set('country', payload.wechatUserInfo.country)
    authUser.set('province', payload.wechatUserInfo.province)
    authUser.set('city', payload.wechatUserInfo.city)
    authUser.set('balance', 0)
    authUser.set('deposit', 0)

    return authUser.save()
  }).then((leanUser) => {
    let userInfo = UserInfo.fromLeancloudObject(leanUser)
    let token = leanUser.getSessionToken()
    return({
      userInfo: userInfo,
      token: token,
    })
  }).catch((error) => {
    console.log("register error", error)

    throw error
  })
}

export function login(payload) {
  let authData = {
    "openid": payload.openid,
    "access_token": payload.accessToken,
    "expires_at": Date.parse(payload.expires_in),
  }
  let platform = 'weixin'

  return AV.User.signUpOrlogInWithAuthData(authData, platform).then((leanUser) => {
    let userInfo = UserInfo.fromLeancloudObject(leanUser)
    let token = leanUser.getSessionToken()
    return({
      userInfo: userInfo,
      token: token,
    })
  }).catch((error) => {
    console.log("login error", error)

    throw error
  })
}

export function getPaymentCharge(payload) {

  return AV.Cloud.run('pingppCreatePayment', payload).then((charge) => {
    return charge
  }).catch((error) => {
    console.log("提交支付请求失败：", error)
    throw error
  })
}

export function fetchOrderByStatus(payload) {
  let orderPayload = {
    userId: payload.userId,
    orderStatus: payload.orderStatus,
    limit: payload.limit,
    lastTurnOnTime: payload.lastTurnOnTime,
    isRefresh: payload.isRefresh,
  }

  return AV.Cloud.run('orderFetchOrdersByStatus', orderPayload).then((result) => {
    let orders = result.orders
    let orderRecordList = []
    orders.forEach((orderInfo) => {
      orderRecordList.push(OrderInfo.fromLeancloudApi(orderInfo))
    })
    return orderRecordList
  }).catch((error) => {
    console.log("获取订单失败：", error)
    throw error
  })
}

export function getTransfer(payload) {
  return AV.Cloud.run('pingppCreateTransfer', payload).then((transfer) => {
    return transfer
  }).catch((error) => {
    console.log("提交提现请求失败：", error)
    throw error
  })
}

export function payOrder(payload) {
  return AV.Cloud.run('orderOrderPayment', payload).then((orderInfo) => {
    return OrderInfo.fromLeancloudApi(orderInfo)
  }).catch((error) => {
    console.log("服务订单支付失败：", error)
    throw error
  })
}

