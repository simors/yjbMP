/**
 * Created by wanpeng on 2017/8/14.
 */
import AV from 'leancloud-storage'
import {APP_NAME} from '../constants/appConfig'


export function fetchWechatInfo(payload) {
  var params = {
    code: payload.code
  }
  return AV.Cloud.run('authFetchWechatUserInfo', params).then((userInfo) => {
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

export function verifySmsCode(payload) {
  let smsCode = payload.smsCode
  let phone = payload.phone
  return AV.Cloud.verifySmsCode(smsCode, phone).then(function (success) {
    return true
  }, function (err) {
    // err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    console.log("verifySmsCode error:", err)
    return false
  })
}

export function register(payload) {

}