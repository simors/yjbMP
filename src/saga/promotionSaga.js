/**
 * Created by wanpeng on 2017/10/20.
 */
import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import * as promotionActionTypes from '../constants/promotionActionTypes'
import { updatePromotionList, savePromotionCategory, savePromotionCategories } from '../actions/promotionActions'
import {fetchPromotionListApi, fetchPromotionCategoriesApi} from '../api/promotion'
import {saveUsers} from '../actions/authActions'

function* fetchPromotion(action) {
  let payload = action.payload

  try {
    let promotions = yield call(fetchPromotionListApi, {})
    yield put(updatePromotionList({ promotions }))
    let users = new Set()
    let categories = new Set()

    promotions.forEach((promotion) => {
      let user = promotion.user
      let category = promotion.category
      if(user) {
        users.add(user)
      }
      if(category) {
        categories.add(category)
      }
    })
    if(users.size > 0) {
      yield put(saveUsers({ users }))
    }
    if(categories.size > 0) {
      yield put(savePromotionCategories({ categories }))
    }
    if(payload.success) {
      payload.success()
    }
  } catch (error) {
    if(payload.error) {
      payload.error(error)
    }
  }
}

function* fetchPromotionCategories(action) {
  let payload = action.payload

  try {
    let categories = yield call(fetchPromotionCategoriesApi, payload)
    yield put(savePromotionCategories({ categories }))
    if(payload.success) {
      payload.success()
    }
  } catch (error) {
    if(payload.error) {
      payload.error(error)
    }
  }
}

export const promotionSaga = [
  takeLatest(promotionActionTypes.FETCH_PROMOTION, fetchPromotion),
  takeLatest(promotionActionTypes.FETCH_PROMOTION_CATEGORYLIST, fetchPromotionCategories)
]