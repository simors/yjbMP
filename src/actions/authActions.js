/**
 * Created by wanpeng on 2017/8/14.
 */
import {createAction} from 'redux-actions'
import * as authActionTypes from '../constants/authActionTypes'

export const requestWechatUserinfo = createAction(authActionTypes.FETCH_WECHAT_USERINFO)
export const requestWechatUserinfoSuccess = createAction(authActionTypes.FETCH_WECHAT_USERINFO_SCCESS)
export const requestSmsCode = createAction(authActionTypes.REQUEST_SMSCODE)
export const submitRegister = createAction(authActionTypes.SUBMIT_REGISTER)
export const registerSuccess = createAction(authActionTypes.REGISTER_SUCCESS)

