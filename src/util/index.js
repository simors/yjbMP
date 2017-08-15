/**
 * Created by wanpeng on 2017/8/14.
 */
import querystring from 'querystring'
import URL from  'url'


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