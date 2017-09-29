/**
 * Created by wanpeng on 2017/9/29.
 */
import {createAction} from 'redux-actions'
import * as orderActionTypes from '../constants/orderActionTypes'

export const fetchOrders = createAction(orderActionTypes.FETCH_ORDERS)
export const fetchOrdersSuccess = createAction(orderActionTypes.FETCH_ORDERS_SUCCESS)
export const paymentOrder = createAction(orderActionTypes.PAYMENT_ORDER)
export const paymentOrderSuccess = createAction(orderActionTypes.PAYMENT_ORDER_SUCCESS)
export const updateOrder = createAction(orderActionTypes.UPDATE_ORDER)
export const updateOrderSuccess = createAction(orderActionTypes.UPDATE_ORDER_SUCCESS)