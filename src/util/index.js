/**
 * Created by wanpeng on 2017/8/14.
 */
import querystring from 'querystring'
import URL from  'url'
import {store} from '../store/persistStore'
import {isUserLogined} from '../selector/authSelector'
import * as appConfig from '../constants/appConfig'


function getAuthorizeURL(redirect, state, scope) {
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
  var info = {
    appid: appConfig.WECHAT_MP_APPID,
    redirect_uri: redirect,
    response_type: 'code',
    scope: scope || 'snsapi_base',
    state: state || ''
  };
  return url + '?' + querystring.stringify(info) + '#wechat_redirect';
}


export function wechatOauth(nextState, replace) {
  var urlObj = URL.parse(document.location.href)
  const {code} = querystring.parse(urlObj.query)
  if(!code) {
    var state = nextState.location.state
    var nextPathname = state? state.nextPathname : ''
    var redirectUrl = getAuthorizeURL(document.location.href, nextPathname, 'snsapi_userinfo')
    document.location = redirectUrl
  }
}

export function oauth(nextState, replace) {
  var state = store.getState()
  let authInfo = localStorage.getItem('reduxPersist:AUTH')
  let activeUser = authInfo? JSON.parse(authInfo).activeUser : undefined
  if(!activeUser && !isUserLogined(state)) {
    replace({
      pathname: '/bind',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

export function formatTime(milliseconds, format) {
  let time = new Date(milliseconds)
  let fullYear = ''
  let month = ''
  let date = ''
  let hours = ''
  let minutes = ''
  let seconds = ''
  format = format || 'YYYY-MM-DD HH:mm:SS'
  if(time) {
    fullYear = time.getFullYear()
    month = time.getMonth() + 1
    month = month < 10 ? '0' + month : month
    date = time.getDate()
    date = date < 10 ? '0' + date : date
    hours = time.getHours()
    hours = hours < 10 ? '0' + hours : hours
    minutes = time.getMinutes()
    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = time.getSeconds()
    seconds = seconds < 10 ? '0' + seconds : seconds
  }
  const result = format.replace('YYYY', fullYear).replace('MM', month).replace('DD', date)
    .replace('HH', hours).replace('mm', minutes).replace('SS', seconds)
  return result
}