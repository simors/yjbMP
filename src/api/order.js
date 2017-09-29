/**
 * Created by wanpeng on 2017/9/29.
 */
import AV from 'leancloud-storage'


export function fetchOrdersApi(payload) {
  let orderPayload = {
    limit: payload.limit,
    lastTurnOnTime: payload.lastTurnOnTime,
    isRefresh: payload.isRefresh,
  }

  return AV.Cloud.run('orderFetchOwnsOrders', orderPayload).then((ownsOrders) => {
    return ownsOrders
  }).catch((error) => {
    console.log("获取订单失败：", error)
    throw error
  })
}

export function payOrderApi(payload) {
  return AV.Cloud.run('orderOrderPayment', payload).then((order) => {
    return order
  }).catch((error) => {
    console.log("服务订单支付失败：", error)
    throw error
  })
}