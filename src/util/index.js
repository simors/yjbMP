/**
 * Created by wanpeng on 2017/8/14.
 */
import {browserHistory} from 'react-router'
import querystring from 'querystring'
import URL from  'url'
import {store} from '../store/persistStore'
import {selectToken} from '../selector/authSelector'
import * as appConfig from '../constants/appConfig'
import {loginWithWechatAuthData} from '../actions/authActions'
import {selectIsRehydrated} from '../selector/configSelector'
import {updateInitUrl} from '../actions/configActions'


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

/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * @returns {String}
 */
export function getMobileOperatingSystem() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }

  return "unknown";
}

export function wechatOauth(nextState, replace) {
  let state = store.getState()
  let isRehydrated = selectIsRehydrated(state)
  if(!isRehydrated) {
    replace({
      pathname: '/loading',
      state: { from: nextState.location }
    })
    return
  }

  let token = selectToken(state)
  if(!token) {
    let urlObj = URL.parse(document.location.href)
    const {openid, access_token, expires_at} = querystring.parse(urlObj.query)
    let authData = undefined
    if (openid && access_token && expires_at) {
      authData = {
        openid,
        access_token,
        expires_at,
      }
    }
    if(authData) {
      store.dispatch(loginWithWechatAuthData({...authData, success: (mobilePhoneNumber) => {
        if(!mobilePhoneNumber) {
          setTimeout(() => {browserHistory.replace('/bind')}, 2000)
        }
      }}))
    } else {
      let wechatOauthUrl = appConfig.LC_SERVER_DOMAIN + '/wechatOauth'
      let nextPathname = nextState.location.pathname
      let redirectUrl = getAuthorizeURL(wechatOauthUrl, nextPathname, 'snsapi_userinfo')
      document.location = redirectUrl
    }
  } else {
    store.dispatch(updateInitUrl({
      url: document.location.href,
    }))
  }
}

export function setInitUrl(nextState, replace) {
  store.dispatch(updateInitUrl({
    url: document.location.href,
  }))
}