/**
 * Created by wanpeng on 2017/9/28.
 */
export function selectStationById(state, stationId) {
  if(!stationId) {
    return undefined
  }
  let stationRecord = state.STATION.getIn(['stations', stationId])
  return stationRecord? stationRecord.toJS() : undefined
}