/**
 * Created by wanpeng on 2017/10/20.
 */
import AV from 'leancloud-storage'

export function fetchPromotionListApi(payload) {
  return AV.Cloud.run('promGetValidPromotionList', payload).then((promotions) => {
    return promotions
  }).catch((error) => {
    throw error
  })
}

export function fetchPromotionCategoriesApi(payload) {
  return AV.Cloud.run('promFetchPromotionCategoryList', payload).then((categories) => {
    return categories
  }).catch((error) => {
    throw error
  })
}