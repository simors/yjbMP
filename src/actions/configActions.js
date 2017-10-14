/**
 * Created by yangyang on 2017/6/28.
 */
import {createAction} from 'redux-actions'
import * as configActionTypes from '../constants/configActionTypes'

export const requestDomainSuccess = createAction(configActionTypes.FETCH_DOMAIN_SUCCESS)
export const requestPosition = createAction(configActionTypes.FETCH_POSITION)
export const requestPositionSuccess = createAction(configActionTypes.FETCH_POSITION_SUCCESS)
export const updateRehydrate = createAction(configActionTypes.UPDATE_REHYDRATE)
export const updateRehydrateSuccess = createAction(configActionTypes.UPDATE_REHYDRATE_SUCCESS)