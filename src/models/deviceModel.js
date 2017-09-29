/**
 * Created by wanpeng on 2017/8/22.
 */
import {Map, List, Record} from 'immutable'

export const DeviceInfoRecord = Record({
  id: undefined,
  deviceNo: undefined,
  status: undefined,
  onlineTime: undefined,
  updateTime: undefined,
  deviceAddr: undefined,
  stationId: undefined,
}, 'DeviceInfoRecord')

export class DeviceInfo extends DeviceInfoRecord {
  static fromLeancloudObject(lcObj) {
    let attrs = lcObj.attributes
    let info = new DeviceInfoRecord()

    return info.withMutations((record) => {
      record.set('id', lcObj.id)
      record.set('deviceNo', attrs['deviceNo'])
      record.set('status', attrs['status'])
      record.set('onlineTime', attrs['onlineTime'])
      record.set('updateTime', attrs['updateTime'])
      record.set('deviceAddr', attrs['deviceAddr'])
      record.set('stationId', attrs['stationId'])
    })
  }

  static fromLeancloudApi(obj) {
    let info = new DeviceInfoRecord()

    return info.withMutations((record) => {
      record.set('id', obj.id)
      record.set('deviceNo', obj.deviceNo)
      record.set('status', obj.status)
      record.set('onlineTime', obj.onlineTime)
      record.set('updateTime', obj.updateTime)
      record.set('deviceAddr', obj.deviceAddr)
      record.set('stationId', obj.stationId)
    })
  }
}

export const DeviceRecord = Record({
  devices: Map(),                 //设备 键为id, 值为DeviceInfoRecord
}, 'DeviceRecord')