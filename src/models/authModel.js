/**
 * Created by wanpeng on 2017/8/14.
 */
import {Map, List, Record} from 'immutable'

export const AuthRecord = Record({
  wechatUserInfo: undefined,
  profile: undefined
}, "AuthRecord")