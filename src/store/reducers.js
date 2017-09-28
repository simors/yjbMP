import { combineReducers } from 'redux'
import locationReducer from './location'
import configReducer from '../reducer/configReducer'
import authReducer from '../reducer/authReducer'
import deviceReducer from '../reducer/deviceReducer'
import stationReducer from '../reducer/stationReducer'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    CONFIG: configReducer,
    AUTH: authReducer,
    DEVICE: deviceReducer,
    STATION: stationReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
