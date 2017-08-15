/**
 * Created by wanpeng on 2017/8/14.
 */

export function selectWechatUserInfo(state) {
  let AUTH = state.AUTH
  return AUTH.wechatUserInfo
}