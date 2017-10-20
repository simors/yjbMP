import { combineReducers } from 'redux'
import locationReducer from './location'
import configReducer from '../reducer/configReducer'
import authReducer from '../reducer/authReducer'
import deviceReducer from '../reducer/deviceReducer'
import stationReducer from '../reducer/stationReducer'
import orderReducer from '../reducer/orderReducer'
import promotionReducer from '../reducer/promotionReducer'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    CONFIG: configReducer,
    AUTH: authReducer,
    DEVICE: deviceReducer,
    STATION: stationReducer,
    ORDER: orderReducer,
    PROMOTION: promotionReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
