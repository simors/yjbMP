/**
 * Created by wanpeng on 2017/8/22.
 */
import {Map, List, Record} from 'immutable'

export const DeviceInfoRecord = Record({
  id: undefined,
  deviceid: undefined,
  status: undefined,
  onlineTime: undefined,
  updateTime: undefined,
}, 'DeviceInfoRecord')

export class DeviceInfo extends DeviceInfoRecord {
  static fromLeancloudObject(lcObj) {
    let attrs = lcObj.attributes
    let info = new DeviceInfoRecord()

    return info.withMutations((record) => {
      record.set('id', lcObj.id)

      record.set('deviceid', attrs['deviceid'])
      record.set('status', attrs['status'])
      record.set('onlineTime', attrs['onlineTime'])
      record.set('updateTime', attrs['updateTime'])
    })
  }

  static fromLeancloudApi(apiObj) {
    let info = new DeviceInfoRecord()

    return info.withMutations((record) => {
      record.set('id', apiObj.id)
      record.set('deviceid', apiObj.deviceId)
      record.set('status', apiObj.status)
      record.set('onlineTime', apiObj.onlineTime)
      record.set('updateTime', apiObj.updateTime)
    })
  }
}

export const DeviceRecord = Record({
  device: DeviceInfoRecord(),
}, 'DeviceRecord')