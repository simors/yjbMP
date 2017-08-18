/**
 * Created by wanpeng on 2017/8/14.
 */
import querystring from 'querystring'
import URL from  'url'
import {store} from '../store/persistStore'
import {selectToken, isUserLogined} from '../selector/authSelector'

const state = store.getState()

function getAuthorizeURL(redirect, state, scope) {
  var url = 'https://open.weixin.qq.com/connect/oauth2/authorize';
  var info = {
    appid: 'wx2c7e7f1a67c78900',
    redirect_uri: redirect,
    response_type: 'code',
    scope: scope || 'snsapi_base',
    state: state || ''
  };

  return url + '?' + querystring.stringify(info) + '#wechat_redirect';
}

export function wechatOauth(nextState, replace, next) {
  var redirectUrl = getAuthorizeURL(document.location.href, '', 'snsapi_userinfo')
  var urlObj = URL.parse(document.location.href)
  const {code} = querystring.parse(urlObj.query)
  if(code) {
    next()
  } else {
    document.location = redirectUrl
  }
}

export function oauth(nextState, replace, next) {
  console.log("是否已登录", isUserLogined(state))
  if(isUserLogined(state)) {
    next()
  } else {
    var redirectUrl = getAuthorizeURL(document.location.href, '', 'snsapi_userinfo')
    var urlObj = URL.parse(document.location.href)
    const {code} = querystring.parse(urlObj.query)
    if(code) {
      next()
    } else {
      document.location = redirectUrl
    }
  }
}