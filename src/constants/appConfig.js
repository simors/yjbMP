/**
 * Created by wanpeng on 2017/8/7.
 */
//LeanCloud环境参数
var LC_APP_ID = ""
var LC_APP_KEY = ""
const LC_DEV_APP_ID = 'QApBtOkMNfNo0lGaHxKBSWXX-gzGzoHsz'      //开发环境
const LC_DEV_APP_KEY = 'znR6wk5JzFU0XIkgKxrM3fnH'
const LC_STAGE_APP_ID = 'HFRm8OUW9tNj2qxz6LuBExBa-gzGzoHsz'    //预上线环境
const LC_STAGE_APP_KEY = 'E9kbn52mW5NL8u15c7Xywf2B'
const LC_PRO_APP_ID = ''                                       //生产环境
const LC_PRO_APP_KEY = ''

//微信公众平台
var WECHAT_MP_APPID = ""
const WECHAT_MP_APPID_DEV = "wx2c7e7f1a67c78900"
const WECHAT_MP_APPID_PRE = "wx792bf5a51051d512"
const WECHAT_MP_APPID_PRO = "wx792bf5a51051d512"


// 支付类型定义
const DEPOSIT = 1                // 押金
const RECHARGE = 2               // 充值
const SERVICE = 3                // 服务消费
const REFUND = 4                 // 押金退款
const WITHDRAW = 5               // 提现

//订单状态
const ORDER_STATUS_UNPAID = 0    //未支付
const ORDER_STATUS_OCCUPIED = 1  //使用中
const ORDER_STATUS_PAID = 2      //已支付

//websocket
var LC_SERVER_DOMAIN = ""
const LC_SERVER_DOMAIN_DEV = "http://yiijiabao-dev.leanapp.cn"
const LC_SERVER_DOMAIN_PRE = "http://yiijiabao-pre.leanapp.cn"
const LC_SERVER_DOMAIN_PRO = ""
const TURN_ON_DEVICE = 'turn_on_device'         //设备开机请求&应答
const TURN_ON_DEVICE_SUCCESS = 'turn_on_device_success'
const TURN_ON_DEVICE_FAILED = 'turn_on_device_failed'

if(process.env.LEANCLOUD_APP_ID === LC_DEV_APP_ID) {          //开发环境
  LC_APP_ID = LC_DEV_APP_ID
  LC_APP_KEY = LC_DEV_APP_KEY
  WECHAT_MP_APPID = WECHAT_MP_APPID_DEV
  LC_SERVER_DOMAIN = LC_SERVER_DOMAIN_DEV

} else if(process.env.LEANCLOUD_APP_ID === LC_STAGE_APP_ID) { //预上线环境
  LC_APP_ID = LC_STAGE_APP_ID
  LC_APP_KEY = LC_STAGE_APP_KEY
  WECHAT_MP_APPID = WECHAT_MP_APPID_PRE
  LC_SERVER_DOMAIN = LC_SERVER_DOMAIN_PRE

} else if(process.env.LEANCLOUD_APP_ID === LC_PRO_APP_ID) {   //生产环境
  LC_APP_ID = LC_PRO_APP_ID
  LC_APP_KEY = LC_PRO_APP_KEY
  WECHAT_MP_APPID = WECHAT_MP_APPID_PRO
  LC_SERVER_DOMAIN = LC_SERVER_DOMAIN_PRO
}

var appConfig = {
  APP_NAME: '衣家宝',

  LC_APP_ID: LC_APP_ID,
  LC_APP_KEY: LC_APP_KEY,

  WECHAT_MP_APPID: WECHAT_MP_APPID,

  DEPOSIT: DEPOSIT,
  RECHARGE: RECHARGE,
  SERVICE: SERVICE,
  REFUND: REFUND,
  WITHDRAW: WITHDRAW,

  ORDER_STATUS_UNPAID: ORDER_STATUS_UNPAID,
  ORDER_STATUS_OCCUPIED: ORDER_STATUS_OCCUPIED,
  ORDER_STATUS_PAID: ORDER_STATUS_PAID,

  LC_SERVER_DOMAIN: LC_SERVER_DOMAIN,
  TURN_ON_DEVICE: TURN_ON_DEVICE,
  TURN_ON_DEVICE_SUCCESS: TURN_ON_DEVICE_SUCCESS,
  TURN_ON_DEVICE_FAILED: TURN_ON_DEVICE_FAILED,
}

module.exports = appConfig


