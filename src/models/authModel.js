/**
 * Created by wanpeng on 2017/8/14.
 */
import {Map, List, Record} from 'immutable'

export const UserInfoRecord = Record({
  id: undefined,
  mobilePhoneNumber: undefined,
  mobilePhoneVerified: undefined,
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
  score: undefined,         //积分
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
        record.set('createdAt', createdAt)
        record.set('updatedAt', updatedAt)
      }
      record.set('mobilePhoneNumber', attrs['mobilePhoneNumber'])
      record.set('mobilePhoneVerified', attrs['mobilePhoneVerified'])
      record.set('avatar', attrs['avatar'])
      record.set('nickname', attrs['nickname'])
      record.set('sex', attrs['sex'])
      record.set('language', attrs['language'])
      record.set('country', attrs['country'])
      record.set('province', attrs['province'])
      record.set('city', attrs['city'])
      record.set('authData', attrs['authData'])
      record.set('score', attrs['score'])
      record.set('subscribe', attrs['subscribe'])
      if(attrs.idName)
        record.set('idName', attrs['idName'])
      if(attrs.idNumber)
        record.set('idNumber', attrs['idNumber'])
      if(attrs.idNameVerified)
        record.set('idNameVerified', attrs['idNameVerified'])
    })
  }

  static fromApi(obj) {
    let info = new UserInfoRecord()

    return info.withMutations((record) => {
      record.set('id', obj.id)
      record.set('mobilePhoneNumber', obj.mobilePhoneNumber)
      record.set('mobilePhoneVerified', obj.mobilePhoneVerified)
      record.set('avatar', obj.avatar)
      record.set('nickname', obj.nickname)
      record.set('sex', obj.sex)
      record.set('authData', obj.authData)
      record.set('language', obj.language)
      record.set('country', obj.country)
      record.set('province', obj.province)
      record.set('city', obj.city)
      record.set('idName', obj.idName)
      record.set('idNumber', obj.idNumber)
      record.set('createdAt', obj.createdAt)
      record.set('updatedAt', obj.updatedAt)
      record.set('subscribe', obj.subscribe)
      record.set('score', obj.score)
      record.set('idNameVerified', obj.idNameVerified)
    })
  }
}

export const DealRecord = Record({
  id: undefined,                  //交易记录id
  orderNo: undefined,             //交易单号
  amount: undefined,              //交易金额
  dealTime: undefined,            //交易时间
  dealType: undefined,            //交易类型
  promotionId: undefined,         //活动id
}, 'DealRecord')

export class Deal extends DealRecord {
  static fromJSON(obj) {
    let recharge = new DealRecord()
    return recharge.withMutations((record) => {
      record.set('id', obj.id)
      record.set('orderNo', obj.order_no)
      record.set('amount', obj.cost)
      record.set('dealTime', obj.dealTime)
      record.set('dealType', obj.dealType)
      record.set('promotionId', obj.promotionId)
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
  process: undefined,                 //状态
}, 'WalletInfoRecord')

export const AuthState = Record({
  activeUser: undefined,              //当前用户id
  token: undefined,                   //自动登录token
  profiles: Map(),                    //用户信息: 键为userId, 值为UserInfoRecord
  dealRecords: Map(),                 //交易记录：键为id,值为DealRecord
  dealList: List(),                   //用户钱包记录id列表
  wallet: undefined,                  //钱包信息
  isRequestRefund: undefined,         //是否有提交押金返还申请
}, "AuthState")