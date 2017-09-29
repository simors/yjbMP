/**
 * Created by wanpeng on 2017/8/14.
 */
import * as appConfig from '../constants/appConfig'

export function selectWechatUserInfo(state) {
  let AUTH = state.AUTH
  return AUTH.wechatUserInfo
}

export function selectUserInfo(state) {
  let AUTH = state.AUTH
  return AUTH.profile.toJS()
}

export function isUserLogined(state) {
  let AUTH = state.AUTH
  let activeUser = AUTH.activeUser
  return activeUser ? true : false
}

export function selectToken(state) {
  let AUTH = state.AUTH
  return AUTH.token
}

export function selectDealRecord(state) {
  let AUTH = state.AUTH
  let dealRecordsMap = AUTH.dealRecords
  let dealRecordList = []
  dealRecordsMap.toArray().forEach((dealRecord) => {
    dealRecordList.push(dealRecord.toJS())
  })
  return dealRecordList
}

export function selectWalletInfo(state) {
  let AUTH = state.AUTH
  return AUTH.wallet.toJS()
}