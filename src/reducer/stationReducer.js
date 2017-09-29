/**
 * Created by wanpeng on 2017/9/28.
 */
import {Map, List, Record} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import {Station, StationState, StationRecord} from '../models/stationModel'
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
  let incoming = action.payload.STATION
  if (!incoming) return state

  const stations = incoming.stations
  if(stations) {
    let stationsMap = new Map(stations)
    try {
      for (let [stationId, station] of stationsMap)
        if(stationId && station) {
          let stationRecord = new StationRecord({...station})
          state = state.setIn(['stations', stationId], stationRecord)
        }
    } catch (error) {
      stationsMap.clear()
    }
  }

  return state
}