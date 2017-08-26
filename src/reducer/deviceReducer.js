/**
 * Created by wanpeng on 2017/8/25.
 */
import {Map, List, Record} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import {DeviceRecord, DeviceInfoRecord} from '../models/deviceModel'
import * as deviceActiontypes from '../constants/deviceActiontypes'

const initialState = DeviceRecord()

export default function deviceReducer(state = initialState, action) {
  switch (action.type) {
    case deviceActiontypes.FETCH_DEVICEINFO_SUCCESS:
      return handleSaveDeviceInfo(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleSaveDeviceInfo(state, action) {
  var payload = action.payload

  state = state.set('device', payload.deviceRecord)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.AUTH
  if (!incoming) return state


  return state
}