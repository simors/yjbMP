/**
 * Created by wanpeng on 2017/8/22.
 */
import { call, put, takeEvery } from 'redux-saga/effects'
import {fetchDeviceInfo} from '../api/device'
import {} from '../actions/deviceActions'
import * as deviceActiontypes from '../constants/deviceActiontypes'

//获取设备信息
export function* fetchDeviceInfoAction(action) {
  let payload = action.payload

  try {
    let deviceInfo = yield call(fetchDeviceInfo, payload)
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