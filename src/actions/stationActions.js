/**
 * Created by wanpeng on 2017/9/28.
 */
import {createAction} from 'redux-actions'
import * as stationActionTypes from '../constants/stationActionTypes'

export const saveStationAction = createAction(stationActionTypes.SAVE_STATION)
export const saveStationsAction = createAction(stationActionTypes.SAVE_STATIONS)

export const updateCurrentStation = createAction(stationActionTypes.UPDATE_CURRENT_STATION)