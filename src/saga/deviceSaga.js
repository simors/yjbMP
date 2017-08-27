/**
 * Created by wanpeng on 2017/8/22.
 */
import { call, put, takeEvery } from 'redux-saga/effects'
import {fetchDeviceInfo, openDevice} from '../api/device'
import {getDeviceInfoSuccess} from '../actions/deviceActions'
import * as deviceActiontypes from '../constants/deviceActiontypes'
import {DeviceInfo} from '../models/deviceModel'

//获取设备信息
export function* fetchDeviceInfoAction(action) {
  let payload = action.payload

  try {
    let deviceInfo = yield call(fetchDeviceInfo, payload)

    var deviceRecord = DeviceInfo.fromLeancloudApi(deviceInfo)
    yield put(getDeviceInfoSuccess({deviceRecord}))
    if(payload.success) {
      payload.success()
    }
  } catch(error) {
    if(payload.error) {
      payload.error(error)
    }
  }
}

//开启设备
export function* openDeviceAction(action) {
  let payload = action.payload

  try {
    let deviceInfo = yield call(openDevice, payload)

    var deviceRecord = DeviceInfo.fromLeancloudApi(deviceInfo)
    yield put(getDeviceInfoSuccess({deviceRecord}))
    if(payload.success) {
      payload.success()
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

export const deviceSaga = [
  takeEvery(deviceActiontypes.FETCH_DEVICEINFO, fetchDeviceInfoAction),
  takeEvery(deviceActiontypes.OPEN_DEVICE, openDeviceAction)
]