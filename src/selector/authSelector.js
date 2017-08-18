/**
 * Created by wanpeng on 2017/8/14.
 */

export function selectWechatUserInfo(state) {
  let AUTH = state.AUTH
  return AUTH.wechatUserInfo
}

export function selectUserInfo(state) {
  let AUTH = state.AUTH
  return AUTH.profile.toJSON()
}

export function isUserLogined(state) {
  let AUTH = state.AUTH
  let activeUser = AUTH.activeUser
  console.log("activeUser", activeUser)
  return activeUser ? true : false
}

export function selectToken(state) {
  let AUTH = state.AUTH
  return AUTH.token
}