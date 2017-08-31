/**
 * Created by wanpeng on 2017/8/7.
 */
export const APP_NAME = '衣家宝'

//LeanCloud环境参数
export const LC_DEV_APP_ID = 'QApBtOkMNfNo0lGaHxKBSWXX-gzGzoHsz'      //开发环境
export const LC_DEV_APP_KEY = 'znR6wk5JzFU0XIkgKxrM3fnH'
export const LC_STAGE_APP_ID = 'HFRm8OUW9tNj2qxz6LuBExBa-gzGzoHsz'    //预上线环境
export const LC_STAGE_APP_KEY = 'E9kbn52mW5NL8u15c7Xywf2B'
export const LC_PRO_APP_ID = ''                                       //生产环境
export const LC_PRO_APP_KEY = ''

//微信公众平台
const WECHAT_MP_TOKEN_DEV = "YiJiaBao2017dev"
const WECHAT_MP_APPID_DEV = "wx2c7e7f1a67c78900"
const WECHAT_MP_AESKEY_DEV = ""
const WECHAT_MP_APPSECRET_DEV = "7e053e63bc216611878697fdb5d8edc6"

const WECHAT_MP_TOKEN_PRE = "YiJiaBao2017pre"
const WECHAT_MP_APPID_PRE = ""
const WECHAT_MP_AESKEY_PRE = ""
const WECHAT_MP_APPSECRET_PRE =""

const WECHAT_MP_TOKEN_PRO = "YiJiaBao2017pro"
const WECHAT_MP_APPID_PRO = "wx792bf5a51051d512"
const WECHAT_MP_AESKEY_PRO = ""
const WECHAT_MP_APPSECRET_PRO = "5532d83f953d75b8f8e3e75826324ac3"

export const WECHAT_MP_TOKEN = WECHAT_MP_TOKEN_DEV
export const WECHAT_MP_APPID = WECHAT_MP_APPID_DEV
export const WECHAT_MP_APPSECRET = WECHAT_MP_APPSECRET_DEV


// 支付类型定义
export const DEPOSIT = 1                // 押金
export const RECHARGE = 2               // 充值
export const SERVICE = 3                // 服务消费
export const REFUND = 4                 // 押金退款
export const WITHDRAW = 5               // 提现

//订单状态
export const ORDER_STATUS_UNPAID = 0    //未支付
export const ORDER_STATUS_OCCUPIED = 1  //使用中
export const ORDER_STATUS_PAID = 2      //已支付

//websocket
export const LC_SERVER_DOMAIN = 'http://yiijiabao.leanapp.cn'
export const TURN_ON_DEVICE = 'turn_on_device'         //设备开机请求&应答
export const TURN_ON_DEVICE_SUCCESS = 'turn_on_device_success'
export const TURN_ON_DEVICE_FAILED = 'turn_on_device_failed'


