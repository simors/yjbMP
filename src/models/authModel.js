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
  idName: undefined,        //真实姓名
  idNumber: undefined,      //身份证号码
  idNameVerified: false,    //实名认证
  subscribe: undefined,     //关注微信公众号
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
      if(attrs.idName)
        record.set('idName', attrs['idName'])
      if(attrs.idNumber)
        record.set('idNumber', attrs['idNumber'])
      if(attrs.idNameVerified)
        record.set('idNameVerified', attrs['idNameVerified'])
    })
  }
}

export const DealInfoRecord = Record({
  orderNo: undefined,
  from: undefined,
  to: undefined,
  cost: undefined,
  dealTime: undefined,
  dealType: undefined,
}, 'DealInfoRecord')

export class DealInfo extends DealInfoRecord {
  static fromLeancloudApi(DealInfo) {
    let info = new DealInfoRecord()

    return info.withMutations((record) => {
      record.set('orderNo', DealInfo.order_no)
      record.set('from', DealInfo.from)
      record.set('to', DealInfo.to)
      record.set('cost', DealInfo.cost)
      record.set('dealTime', DealInfo.dealTime)
      record.set('dealType', DealInfo.dealType)
    })
  }
}

export const WalletInfoRecord = Record({
  userId: undefined,                  //用户id
  balance: undefined,                 //余额
  deposit: undefined,                 //押金
  openid: undefined,                  //用户微信openid
  debt: undefined,                    //欠费
  user_name: undefined,               //身份证姓名
  score: undefined,                   //积分
}, 'WalletInfoRecord')


export const AuthRecord = Record({
  activeUser: undefined,              //当前用户id
  token: undefined,                   //自动登录token
  wechatUserInfo: undefined,          //用户微信信息
  profile: UserInfoRecord(),          //用户信息
  dealRecords: Map(),                 //交易记录：键为order_no,值为DealInfoRecord
  wallet: WalletInfoRecord(),         //钱包信息
}, "AuthRecord")