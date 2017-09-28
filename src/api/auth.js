/**
 * Created by wanpeng on 2017/8/14.
 */
import AV from 'leancloud-storage'
import * as appConfig from '../constants/appConfig'
import {UserInfo, OrderInfo, DealInfo} from '../models/authModel'
import {Map, List, Record} from 'immutable'

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
    name: appConfig.APP_NAME,
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

export function fetchOrdersApi(payload) {
  let orderPayload = {
    limit: payload.limit,
    lastTurnOnTime: payload.lastTurnOnTime,
    isRefresh: payload.isRefresh,
  }

  return AV.Cloud.run('orderFetchOwnsOrders', orderPayload).then((ownsOrders) => {
    let orderList = List()
    console.log("ownsOrders", ownsOrders)
    ownsOrders.forEach((order) => {
      orderList = orderList.push(OrderInfo.fromLeancloudApi(order))
    })
    return orderList
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
  return AV.Cloud.run('orderOrderPayment', payload).then((order) => {
    return order
  }).catch((error) => {
    console.log("服务订单支付失败：", error)
    throw error
  })
}

export function getWalletInfo(payload) {
  return AV.Cloud.run('authFetchWalletInfo', payload).then((walletInfo) => {
    return walletInfo
  }).catch((error) => {
    console.log("获取钱包信息失败：", error)
    throw error
  })
}

export function getDealRecords(payload) {
  return AV.Cloud.run('authFetchDealRecords', payload).then((records) => {
    let dealRecordList = []
    records.forEach((record) => {
      dealRecordList.push(DealInfo.fromLeancloudApi(record))
    })
    return dealRecordList
  }).catch((error) => {
    console.log("获取交易信息失败：", error)
    throw error
  })
}

export function verifyIdName(payload) {
  return AV.Cloud.run('authVerifyIdName', payload).then((userInfo) => {
    return userInfo
  }).catch((error) => {
    console.log("发送实名认证请求失败：", error)
    throw error
  })
}

export function getJssdkConfig(payload) {
  return AV.Cloud.run('getJsConfig', payload).then((configInfo) => {
    return configInfo
  }).catch((error) => {
    console.log("获取微信js-sdk config失败：", error)
    throw error
  })
}
