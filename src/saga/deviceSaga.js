/**
 * Created by wanpeng on 2017/8/22.
 */
import { call, put, takeEvery } from 'redux-saga/effects'
import {fetchDeviceInfo} from '../api/device'
import {saveDevice} from '../actions/deviceActions'
import * as deviceActiontypes from '../constants/deviceActiontypes'
import {saveStationAction, updateCurrentStation} from '../actions/stationActions'

//获取设备信息
export function* fetchDeviceInfoAction(action) {
  let payload = action.payload

  try {
    let device = yield call(fetchDeviceInfo, payload)
    let station = device? device.station : undefined
    if(device) {
      yield put(saveDevice({device: device}))
    }
    if(station) {
      yield put(updateCurrentStation({station: station}))
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
]