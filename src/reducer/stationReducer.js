/**
 * Created by wanpeng on 2017/9/28.
 */
import {Map, List, Record} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import {Station, StationState} from '../models/stationModel'
import * as stationActionTypes from '../constants/stationActionTypes'

const initialState = StationState()

export default function stationReducer(state = initialState, action) {
  switch (action.type) {
    case stationActionTypes.SAVE_STATION:
      return handleSaveStation(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleSaveStation(state, action) {
  let station = action.payload.station
  let stationRecord = Station.fromApi(station)

  state = state.setIn(['stations', station.id], stationRecord)
  return state
}

function onRehydrate(state, action) {
  return state
}