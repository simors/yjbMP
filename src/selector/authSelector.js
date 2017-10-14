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
  let AUTH = state.AUTH
  return AUTH.wallet.toJS()
}