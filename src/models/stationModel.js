/**
 * Created by wanpeng on 2017/9/28.
 */
import {Map, List, Record} from 'immutable'

export const StationRecord = Record({
  id: undefined,              //服务点id
  name: undefined,            //服务点名称
  province: undefined,        //省份
  city:undefined,             //城市
  area: undefined,            //区
  admin: undefined,           //管理员用户id
  status: undefined,          //服务点状态
  deviceSum: undefined,       //设备总数
  addr: undefined,            //详细地址
  unitPrice: undefined,       //计费单价 单位：元／分钟
})

export class Station extends StationRecord {
  static fromApi(obj) {
    let station = new StationRecord()
    return station.withMutations((record) => {
      record.set('id', obj.id)
      record.set('name', obj.name)
      record.set('province', obj.province)
      record.set('city', obj.city)
      record.set('area', obj.area)
      record.set('admin', obj.adminId)
      record.set('status', obj.status)
      record.set('deviceSum', obj.deviceSum)
      record.set('addr', obj.addr)
      record.set('unitPrice', obj.unitPrice)
    })
  }
}

export const StationState = Record({
  stations: Map(),             //服务网点 键为id，值为StationRecord
}, 'StationState')