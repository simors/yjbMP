/**
 * Created by wanpeng on 2017/8/14.
 */
export function selectActiveUserInfo(state) {
  let activeUserId = state.AUTH.get('activeUser')
  if(!activeUserId) {
    return undefined
  }
  let userRecord = state.AUTH.getIn(['profiles', activeUserId])
  return userRecord? userRecord.toJS() : undefined
}

export function selectActiveUserId(state) {
  let activeUserId = state.AUTH.get('activeUser')
  return activeUserId
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
  let walletRecord = state.AUTH.get('wallet')
  return walletRecord? walletRecord.toJS() : undefined
}

export function selectIsRefunding(state) {
  let isRequestRefund = state.AUTH.get('isRequestRefund')
  if (isRequestRefund == undefined) {
    return true       // 为了资金安全，如果没有获取到是否提交了押金取现申请，也返回true，是的用户无法提交申请
  }
  return isRequestRefund
}