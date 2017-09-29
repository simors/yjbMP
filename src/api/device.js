/**
 * Created by wanpeng on 2017/8/22.
 */
import AV from 'leancloud-storage'
import {UserInfo} from '../models/authModel'


export function fetchDeviceInfo(payload) {
  var params = {
    deviceNo: payload.deviceNo
  }

  return AV.Cloud.run('deviceFetchDeviceInfo', params).then((device) => {
    return device
  }).catch((error) => {
    console.log("获取设备信息失败：", error)
    throw error
  })
}
