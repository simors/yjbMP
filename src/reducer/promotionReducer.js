/**
 * Created by wanpeng on 2017/10/20.
 */
import {Map, List, Record} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import {PromotionState, Promotion, PromotionCategory} from '../models/promotionModel'
import * as promotionActionTypes from '../constants/promotionActionTypes'

const initialState = PromotionState()

export default function promotionReducer(state = initialState, action) {
  switch (action.type) {
    case promotionActionTypes.SAVE_PROMOTION:
      return handleSaveProm(state, action)
    case promotionActionTypes.SAVE_PROMOTIONS:
      return handleSaveProms(state, action)
    case promotionActionTypes.SAVE_PROMOTION_CATEGORY:
      return handleSaveCategory(state, action)
    case promotionActionTypes.SAVE_PROMOTION_CATEGORIES:
      return handleSavePromotionCategories(state, action)
    case promotionActionTypes.UPDATE_PROMOTION_LIST:
      return handleUpdatePromList(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleUpdatePromList(state, action) {
  let promotions = action.payload.promotions
  let promotionList = List()
  promotions.forEach((promotion) => {
    let promotionRecord = Promotion.fromApi(promotion)
    state = state.setIn(['promotions', promotion.id], promotionRecord)
    promotionList = promotionList.push(promotion.id)
  })
  state = state.set('promotionList', promotionList)
  return state
}

function handleSaveProm(state, action) {
  let promotion = action.payload.promotion
  if(!promotion) {
    return state
  }
  let promotionRecord = Promotion.fromApi(promotion)
  state = state.setIn(['promotions', promotion.id], promotionRecord)
  return state
}

function handleSaveCategory(state, action) {
  let category = action.payload.category
  if(!category) {
    return state
  }
  let categoryRecord = PromotionCategory.fromApi(category)
  state = state.setIn(['categories', category.id], categoryRecord)
  return state
}

function handleSavePromotionCategories(state, action) {
  let categories = action.payload.categories
  if(!categories) {
    return state
  }
  categories.forEach((category) => {
    let categoryRecord = PromotionCategory.fromApi(category)
    state = state.setIn(['categories', category.id], categoryRecord)
  })
  return state
}

function handleSaveProms(state, action) {
  let promotions = action.payload.promotions
  if(!promotions) {
    return state
  }
  promotions.forEach((promotion) => {
    let promotionRecord = Promotion.fromApi(promotion)
    state = state.setIn(['promotions', promotion.id], promotionRecord)
  })
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.PROMOTION
  if (!incoming) return state

  let promotionMap = new Map(incoming.promotions)
  try {
    for (let [promotionId, promotion] of promotionMap) {
      if(promotionId && promotion) {
        let promotionRecord = new PromotionRecord({...promotion})
        state = state.setIn(['promotions', promotionId], promotionRecord)
      }
    }
  } catch (error) {
    promotionMap.clear()
  }

  let categoryMap = new Map(incoming.categories)
  try {
    for (let [categoryId, category] of categoryMap) {
      if(categoryId && category) {
        let categoryRecord = new PromotionCategoryRecord({...category})
        state =state.setIn(['categories', categoryId], categoryRecord)
      }
    }
  } catch (error) {
    categoryMap.clear()
  }

  let promotionList = incoming.promotionList
  if(promotionList) {
    state = state.set('promotionList', List(promotionList))
  }

  return state
}