/**
 * Created by yangyang on 2017/6/28.
 */
import {persistStore} from 'redux-persist'
import createFilter from 'redux-persist-transform-filter'
import immutableTransform from 'redux-persist-transform-immutable'
import createStore from './createStore'
import {isUserLogined, selectToken} from '../selector/authSelector'
import {autoLogin} from '../actions/authActions'

const configFilter = createFilter('CONFIG', 'AUTH', [])

export default function persist(store) {
  return persistStore(store, {
    whitelist: ['CONFIG', 'AUTH'],
    // transforms: [configFilter]
  }, () => {
    // TODO: add function after rehydration is finished
    let state = store.getState()
    if(isUserLogined(state)) {
      let token = selectToken(state)
      store.dispatch(autoLogin({token: token}))
    }
  })
}


export const store = createStore(window.__INITIAL_STATE__)
export const persistor = persist(store)