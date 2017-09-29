/**
 * Created by wanpeng on 2017/8/25.
 */
export function selectDeviceByDeviceNo(state, deviceNo) {
  if(!deviceNo) {
    return undefined
  }

  let devicesMap = state.DEVICE.get('devices')

  let deviceRecord = devicesMap.find((value) => {
    return value.deviceNo === deviceNo
  })
  return deviceRecord? deviceRecord.toJS() : undefined
}