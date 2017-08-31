/**
 * Created by wanpeng on 2017/8/14.
 */
import {Map, List, Record} from 'immutable'

export const UserInfoRecord = Record({
  id: undefined,
  mobilePhoneNumber: undefined,
  avatar: undefined,
  nickname: undefined,
  sex: undefined,
  authData: undefined,
  language: undefined,
  country: undefined,
  province: undefined,
  city: undefined,
  createdAt: undefined,
  updatedAt: undefined,
  balance: undefined,
  deposit: undefined,

}, 'UserInfoRecord')

export class UserInfo extends UserInfoRecord {
  static fromLeancloudObject(lcObj) {
    let attrs = lcObj.attributes
    let info = new UserInfoRecord()

    return info.withMutations((record) => {
      record.set('id', lcObj.id)

      if(lcObj.createdAt) {
        let createdAt = lcObj.createdAt
        let updatedAt = lcObj.updatedAt
        record.set('createdAt', createdAt.valueOf())
        record.set('updatedAt', updatedAt.valueOf())
      }
      record.set('mobilePhoneNumber', attrs['mobilePhoneNumber'])
      record.set('avatar', attrs['avatar'])
      record.set('nickname', attrs['nickname'])
      record.set('sex', attrs['sex'])
      record.set('language', attrs['language'])
      record.set('country', attrs['country'])
      record.set('province', attrs['province'])
      record.set('city', attrs['city'])
      record.set('authData', attrs['authData'])
      record.set('balance', attrs['balance'])
      record.set('deposit', attrs['deposit'])
    })
  }
}
export const OrderInfoRecord = Record({
  id: undefined,            //订单id
  orderNo: undefined,       //订单编号
  status: undefined,        //订单状态
  createTime: undefined,    //下单时间
  deviceNo: undefined,      //设备编号
  deviceAddr: undefined,    //设备地址
  amount: undefined,        //服务费用
  userId: undefined,        //用户id
}, 'OrderInfoRecord')

export class OrderInfo extends OrderInfoRecord {
  static fromLeancloudApi(orderInfo) {
    let info = new OrderInfoRecord()

    return info.withMutations((record) => {
      record.set('id', orderInfo.id)
      record.set('orderNo', orderInfo.orderNo)
      record.set('status', orderInfo.status)
      record.set('createTime', orderInfo.createTime)
      record.set('deviceNo', orderInfo.deviceNo)
      record.set('deviceAddr', orderInfo.deviceAddr)
      record.set('amount', orderInfo.amount || 0)
      record.set('userId', orderInfo.userId)
    })
  }
}

export const AuthRecord = Record({
  activeUser: undefined,              //当前用户id
  token: undefined,                   //自动登录token
  wechatUserInfo: undefined,          //用户微信信息
  profile: UserInfoRecord(),          //用户信息
  orders: Map(),                      //用户订单：键为订单id，OrderInfoRecord
}, "AuthRecord")