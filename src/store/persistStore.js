/**
 * Created by yangyang on 2017/6/28.
 */
import {persistStore} from 'redux-persist'
import createFilter from 'redux-persist-transform-filter'
import createStore from './createStore'
import {selectToken} from '../selector/authSelector'
import {autoLogin} from '../actions/authActions'
import {updateRehydrate} from '../actions/configActions'
import {browserHistory} from 'react-router'

const configFilter = createFilter('CONFIG', 'AUTH', [])

export default function persist(store) {
  return persistStore(store, {
    whitelist: ['CONFIG', 'AUTH', 'DEVICE', 'STATION', 'ORDER'],
    // transforms: [configFilter]
  }, () => {
    // TODO: add function after rehydration is finished
    let state = store.getState()
    let token = selectToken(state)
    if(token) {
      store.dispatch(autoLogin({token: token, success: (mobilePhoneNumber) => {
        if(!mobilePhoneNumber) {
          browserHistory.replace('/bind')
        }
      }}))
    }
    setTimeout(function () {
      store.dispatch(updateRehydrate({rehydrated: true}))
    }, 2000)
  })
}


export const store = createStore(window.__INITIAL_STATE__)
export const persistor = persist(store)