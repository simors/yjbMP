import { combineReducers } from 'redux'
import locationReducer from './location'
import configReducer from '../reducer/configReducer'
import authReducer from '../reducer/authReducer'

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location: locationReducer,
    CONFIG: configReducer,
    AUTH: authReducer,
    ...asyncReducers
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
