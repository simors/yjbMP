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
    case deviceActiontypes.SAVE_DEVICE:
      return handleSaveDevice(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleSaveDevice(state, action) {
  let device = action.payload.device
  let deviceRecord = DeviceInfo.fromLeancloudApi(device)
  state = state.setIn(['devices', device.id], deviceRecord)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.DEVICE
  if (!incoming) return state

  const devices = incoming.devices
  if(devices) {
    let devicesMap = new Map(devices)
    try {
      for (let [deviceId, device] of devicesMap) {
        if(deviceId && device) {
          let deviceRecord = new DeviceInfoRecord({...device})
          state = state.setIn(['devices', deviceId], deviceRecord)
        }
      }
    } catch (error) {
      devicesMap.clear()
    }
  }

  return state
}