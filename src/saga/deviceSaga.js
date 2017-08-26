/**
 * Created by wanpeng on 2017/8/22.
 */
import { call, put, takeEvery } from 'redux-saga/effects'
import {fetchDeviceInfo} from '../api/device'
import {requestDeviceInfoSuccess} from '../actions/deviceActions'
import * as deviceActiontypes from '../constants/deviceActiontypes'
import {DeviceInfo} from '../models/deviceModel'

//获取设备信息
export function* fetchDeviceInfoAction(action) {
  let payload = action.payload

  try {
    let deviceInfo = yield call(fetchDeviceInfo, payload)

    console.log("deviceInfo:", deviceInfo)
    var deviceRecord = DeviceInfo.fromLeancloudApi(deviceInfo)
    yield put(requestDeviceInfoSuccess({deviceRecord}))
    if(payload.success) {
      payload.success()
    }
  } catch(error) {
    if(payload.error) {
      payload.error(error)
    }
  }
}

export const deviceSaga = [
  takeEvery(deviceActiontypes.FETCH_DEVICEINFO, fetchDeviceInfoAction)
]