/**
 * Created by wanpeng on 2017/8/14.
 */
import {createAction} from 'redux-actions'
import * as authActionTypes from '../constants/authActionTypes'

export const requestUserinfo = createAction(authActionTypes.FETCH_USERINFO)
export const requestSmsCode = createAction(authActionTypes.REQUEST_SMSCODE)
export const submitRegister = createAction(authActionTypes.SUBMIT_REGISTER)
export const registerSuccess = createAction(authActionTypes.REGISTER_SUCCESS)
export const loginSuccess = createAction(authActionTypes.LOGIN_SUCCESS)
export const loginOut = createAction(authActionTypes.LOGIN_OUT)
export const autoLogin = createAction(authActionTypes.AUTO_LOGIN)
export const requestVerifyIdName = createAction(authActionTypes.REQUEST_VERIFY_IDNAME)
export const saveIdNameInfo = createAction(authActionTypes.SAVE_IDNAME_INFO)
export const autoLoginSuccess = createAction(authActionTypes.AUTO_LOGIN_SUCCESS)

export const createPayment = createAction(authActionTypes.CREATE_PAYMENT)
export const createTransfer = createAction(authActionTypes.CREATE_TRANSFER)


export const fetchWalletInfo = createAction(authActionTypes.FETCH_WALLET_INFO)
export const fetchWalletInfoSuccess = createAction(authActionTypes.FETCH_WALLET_INFO_SUCCESS)
export const fetchDealRecords = createAction(authActionTypes.FETCH_DEAL_RECORDS)
export const fetchDealRecordsSuccess = createAction(authActionTypes.FETCH_DEAL_RECORDS_SUCCESS)

export const fetchWechatJssdkConfig = createAction(authActionTypes.FETCH_WECHAT_JSSDK_CONFIG)
