/**
 * Created by wanpeng on 2017/10/20.
 */
import {Map, List, Record} from 'immutable'

export const PromotionRecord = Record({
  id: undefined,                //活动id
  title: undefined,             //活动名称
  start: undefined,             //活动起始时间
  end: undefined,               //活动结束时间
  description: undefined,       //活动描述
  categoryId: undefined,        //活动类型id
  region: undefined,            //活动区域
  disabled: undefined,          //活动状态
  createdAt: undefined,         //活动创建时间
  awards: undefined,            //活动奖品参数
  userId: undefined,            //活动创建用户id
  stat: undefined,              //活动统计结果
}, 'PromotionRecord')

export class Promotion extends PromotionRecord {
  static fromApi(obj) {
    let promotion = new PromotionRecord()
    return promotion.withMutations((record) => {
      record.set('id', obj.id)
      record.set('title', obj.title)
      record.set('start', obj.start)
      record.set('end', obj.end)
      record.set('description', obj.description)
      record.set('categoryId', obj.categoryId)
      record.set('region', obj.region)
      record.set('disabled', obj.disabled)
      record.set('createdAt', obj.createdAt)
      record.set('awards', obj.awards)
      record.set('userId', obj.userId)
      record.set('stat', obj.stat)
    })
  }
}

export const PromotionCategoryRecord = Record({
  id: undefined,                //活动类型id
  title: undefined,             //活动类型名称
  description: undefined,       //活动类型描述
}, 'PromotionRecord')

export class PromotionCategory extends PromotionCategoryRecord {
  static fromApi(obj) {
    let category = new PromotionCategoryRecord()
    return category.withMutations((record) => {
      record.set('id', obj.id)
      record.set('title', obj.title)
      record.set('description', obj.description)
    })
  }
}

export const PromotionState = Record({
  promotions: Map(),
  promotionList: List(),    //有效活动id列表
  categories: Map(),
}, 'PromotionState')