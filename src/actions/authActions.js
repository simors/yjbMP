/**
 * Created by wanpeng on 2017/8/14.
 */
import {createAction} from 'redux-actions'
import * as authActionTypes from '../constants/authActionTypes'

export const requestUserinfo = createAction(authActionTypes.FETCH_USERINFO)
export const requestUserinfoSuccess = createAction(authActionTypes.FETCH_USERINFO_SCCESS)
export const requestSmsCode = createAction(authActionTypes.REQUEST_SMSCODE)
export const submitRegister = createAction(authActionTypes.SUBMIT_REGISTER)
export const registerSuccess = createAction(authActionTypes.REGISTER_SUCCESS)
export const loginSuccess = createAction(authActionTypes.LOGIN_SUCCESS)
export const loginOut = createAction(authActionTypes.LOGIN_OUT)
export const autoLogin = createAction(authActionTypes.AUTO_LOGIN)
export const loginAction = createAction(authActionTypes.LOGIN)

export const createPayment = createAction(authActionTypes.CREATE_PAYMENT)

export const fetchOrderInfo = createAction(authActionTypes.FETCH_ORDER_INFO)
export const saveOrderInfo = createAction(authActionTypes.SAVE_ORDER_INFO)

