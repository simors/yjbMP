/**
 * Created by wanpeng on 2017/10/20.
 */
import {createAction} from 'redux-actions'
import * as promotionActionTypes from '../constants/promotionActionTypes'

export const fetchPromotionAction = createAction(promotionActionTypes.FETCH_PROMOTION)
export const savePromotion = createAction(promotionActionTypes.SAVE_PROMOTION)
export const savePromotions = createAction(promotionActionTypes.SAVE_PROMOTIONS)
export const savePromotionCategory = createAction(promotionActionTypes.SAVE_PROMOTION_CATEGORY)
export const savePromotionCategories = createAction(promotionActionTypes.SAVE_PROMOTION_CATEGORIES)
export const fetchPromCategoryAction = createAction(promotionActionTypes.FETCH_PROMOTION_CATEGORYLIST)
export const updatePromotionList = createAction(promotionActionTypes.UPDATE_PROMOTION_LIST)