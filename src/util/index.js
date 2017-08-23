/**
 * Created by wanpeng on 2017/8/14.
 */
import querystring from 'querystring'
import URL from  'url'
import {store} from '../store/persistStore'
import {isUserLogined} from '../selector/authSelector'


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
