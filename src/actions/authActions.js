/**
 * Created by wanpeng on 2017/8/14.
 */
import {createAction} from 'redux-actions'
import * as authActionTypes from '../constants/authActionTypes'

export const requestSmsCode = createAction(authActionTypes.REQUEST_SMSCODE)
export const loginSuccess = createAction(authActionTypes.LOGIN_SUCCESS)
export const logout = createAction(authActionTypes.LOGOUT)
export const autoLogin = createAction(authActionTypes.AUTO_LOGIN)
export const requestVerifyIdName = createAction(authActionTypes.REQUEST_VERIFY_IDNAME)
export const saveIdNameInfo = createAction(authActionTypes.SAVE_IDNAME_INFO)
export const autoLoginSuccess = createAction(authActionTypes.AUTO_LOGIN_SUCCESS)
export const loginWithWechatAuthData = createAction(authActionTypes.LOGIN_WITH_WECHAT_AUTHDATA)
export const saveUser = createAction(authActionTypes.SAVE_USER)
export const saveUsers = createAction(authActionTypes.SAVE_USERS)
export const setMobilePhone = createAction(authActionTypes.SET_MOBILE_PHONE)

export const createPayment = createAction(authActionTypes.CREATE_PAYMENT)
export const createTransfer = createAction(authActionTypes.CREATE_TRANSFER)


export const fetchWalletInfo = createAction(authActionTypes.FETCH_WALLET_INFO)
export const fetchWalletInfoSuccess = createAction(authActionTypes.FETCH_WALLET_INFO_SUCCESS)
export const fetchDealRecords = createAction(authActionTypes.FETCH_DEAL_RECORDS)
export const fetchDealRecordsSuccess = createAction(authActionTypes.FETCH_DEAL_RECORDS_SUCCESS)

export const fetchWechatJssdkConfig = createAction(authActionTypes.FETCH_WECHAT_JSSDK_CONFIG)

export const requestRefund = createAction(authActionTypes.REQUEST_REFUND)
export const fetchLastRefund = createAction(authActionTypes.FETCH_LAST_REFUND)
export const updateIsRefund = createAction(authActionTypes.UPDATE_IS_REQUEST_REFUND)