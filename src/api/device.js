/**
 * Created by wanpeng on 2017/8/22.
 */
import AV from 'leancloud-storage'
import {APP_NAME} from '../constants/appConfig'
import {UserInfo} from '../models/authModel'
import { } from '../models/deviceModel'

export function fetchDeviceInfo(payload) {
  var params = {
    deviceid: payload.deviceid
  }

  return AV.Cloud.run('deviceFetchDeviceInfo', params).then((deviceInfo) => {
    console.log("deviceFetchDeviceInfo result", deviceInfo)
    return deviceInfo
  }).catch((error) => {
    console.log("获取设备信息失败：", error)
    throw error
  })
}