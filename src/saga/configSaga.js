/**
 * Created by yangyang on 2017/6/28.
 */
import { call, put, takeEvery, takeLatest} from 'redux-saga/effects'
import {fetchDomain, fetchPosition} from '../api/config'
import * as configActionTypes from '../constants/configActionTypes'
import {requestDomainSuccess, requestPositionSuccess, updateRehydrateSuccess, updateInitUrlSuccess} from '../actions/configActions'
import {Location} from '../models/configModel'

export function* fetchDomainAction(action) {
  let payload = action.payload
  let domain = yield call(fetchDomain, payload)
  yield put(requestDomainSuccess({domain}))
}

export function* fetchPositionAction(action) {
  let payload = action.payload
  let position = yield call(fetchPosition, payload)
  yield put(requestPositionSuccess({location: Location.fromApi(position)}))
}

function* updateAppRehydrate(action) {
  let payload = action.payload
  try {
    yield put(updateRehydrateSuccess(payload))
  } catch (error) {
    console.log('update App State error:', error)
  }
}

function* updateInitUrl(action) {
  let payload = action.payload
  try {
    yield put(updateInitUrlSuccess(payload))
  } catch (error) {
    console.log('update InitUrl error:', error)
  }
}

export const configSaga = [
  takeLatest(configActionTypes.FETCH_DOMAIN, fetchDomainAction),
  takeLatest(configActionTypes.FETCH_POSITION, fetchPositionAction),
  takeLatest(configActionTypes.UPDATE_REHYDRATE, updateAppRehydrate),
  takeLatest(configActionTypes.UPDATE_INIT_URL, updateInitUrl),
]