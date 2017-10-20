/**
 * Created by wanpeng on 2017/10/20.
 */
export function selectPromotion(state, promotionId) {
  if(!promotionId) {
    return undefined
  }
  let promotionRecord = state.PROMOTION.getIn(['promotions', promotionId])
  return promotionRecord? promotionRecord.toJS() : undefined
}
/**
 * 获取指定类型的有效活动
 * 备注：同类型的有效活动最多只有一个
 * @param state
 * @param categoryId  活动类型id
 */
export function selectPromByCategoryId(state, categoryId) {
  if(!categoryId) {
    return undefined
  }
  let promotion = undefined
  let promotionList = state.PROMOTION.get('promotionList')
  promotionList.toArray().forEach((promotionId) => {
    let promotionInfo = selectPromotion(state, promotionId)
    if(promotionInfo.categoryId === categoryId) {
      promotion = promotionInfo
    }
  })
  return promotion
}

export function selectCategory(state, categoryId) {
  if(!categoryId) {
    return undefined
  }
  let categoryRecord = state.PROMOTION.getIn(['categories', categoryId])
  return categoryRecord? categoryRecord.toJS() : undefined
}

export function selectCategoryByTitle(state, title) {
  if(!title) {
    return undefined
  }
  let categoryMap = state.PROMOTION.get('categories')
  let categoryRecord = categoryMap.find((category) => {
    return category.title == title
  })
  return categoryRecord? categoryRecord.toJS() : undefined
}

