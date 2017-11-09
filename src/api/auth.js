/**
 * Created by wanpeng on 2017/8/14.
 */
import AV from 'leancloud-storage'
import {UserInfo, OrderInfo, DealInfo} from '../models/authModel'
import appConfig from '../constants/appConfig'

export function become(payload) {
  let token = undefined
  let user = undefined
  return AV.User.become(payload.token).then((leanUser) => {
    user = leanUser
    token = leanUser.getSessionToken()
    let openid = leanUser.attributes.authData.weixin.openid
    return AV.Cloud.run('wechatIsSubscribe', {openid: openid})
  }).then((subscribe) => {
    return {
      token: token,
      user: user,
      subscribe: subscribe,
    }
  }).catch((error) => {
    throw error
  })
}

export function requestLeanSmsCode(payload) {
  let phone = payload.phone

  return AV.Cloud.requestSmsCode({
    mobilePhoneNumber:phone,
    name: appConfig.APP_NAME,
    op: '绑定手机',
    ttl: 10})
}

export function setMobilePhoneAPi(payload) {
  return AV.Cloud.run("authSetUserMobilePhone", payload).then((user) => {
    return user
  }).catch((error) => {
    console.error(error)
    throw error
  })
}

/**
 * 使用authData完成登录，目前只支持微信登录
 * authData的格式如下：
 *
 * authData = {
 *  "openid": openid,
 *  "access_token": accessToken,
 *  "expires_at": Date.parse(expires_in),
 *}
 *
 * @param payload
 * @returns {Promise.<TResult>}
 */
export function loginAuthData(payload) {
  let authData = payload
  let platform = 'weixin'

  return AV.User.signUpOrlogInWithAuthData(authData, platform).then((leanUser) => {
    let token = leanUser.getSessionToken()
    return({
      userInfo: leanUser,
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

export function getTransfer(payload) {
  return AV.Cloud.run('pingppCreateTransfer', payload).then((transfer) => {
    return transfer
  }).catch((error) => {
    console.log("提交提现请求失败：", error)
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
  return AV.Cloud.run('pingppFetchDealRecord', payload).then((result) => {
    return result
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

export async function createWithdrawApply(payload) {
  let params = {
    amount: payload.amount,
    applyType: payload.applyType,
  }
  return await AV.Cloud.run('withdrawCreateApply', params)
}

export async function fetchLastRefund(payload) {
  return await AV.Cloud.run('withdrawFetchLastRefund')
}