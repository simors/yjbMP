/**
 * Created by wanpeng on 2017/8/25.
 */
import {Map, List, Record} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import {DeviceRecord, DeviceInfo, DeviceInfoRecord} from '../models/deviceModel'
import * as deviceActiontypes from '../constants/deviceActiontypes'

const initialState = DeviceRecord()

export default function deviceReducer(state = initialState, action) {
  switch (action.type) {
    case deviceActiontypes.FETCH_DEVICEINFO_SUCCESS:
      return handleFetchDeviceSuccess(state, action)
    case deviceActiontypes.SAVE_DEVICE:
      return handleSaveDevice
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleFetchDeviceSuccess(state, action) {
  var payload = action.payload
  state = state.set('device', payload.deviceRecord)
  return state
}

function handleSaveDevice(state, action) {
  let device = action.payload.device
  let deviceRecord = DeviceInfo.fromLeancloudApi(device)
  state = state.setIn(['devices', device.id], deviceRecord)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.AUTH
  if (!incoming) return state


  return state
}