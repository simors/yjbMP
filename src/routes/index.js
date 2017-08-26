// We only need to import the modules necessary for initial render
import React from 'react'
import { Router, Route, IndexRoute, browserHistory} from 'react-router'
import {oauth, wechatOauth} from  '../util'

import AppIndex from '../components/AppIndex'
import Home from '../components/Home'
import About from '../components/About'
import BindSuccess from '../components/Auth/BindSuccess'
import Mine from '../components/Mine'
import OpenDevice from '../components/Device/OpenDevice'
import ModifyProfile from '../components/Mine/ModifyProfile'
import ModifyNickname from '../components/Mine/ModifyNickname'
import Wallet from '../components/Mine/Wallet'
import Certification from '../components/Mine/Certification'
import Recharge from '../components/Mine/Recharge'
import Score from '../components/Mine/Score'
import WalletDetail from '../components/Mine/WalletDetail'
import Orders from '../components/Mine/Orders'
import OrderDetail from '../components/Mine/OrderDetail'
import Bind from '../components/Auth/Bind'


const routes = (
  <Route path="/" component={AppIndex}>
    <IndexRoute component={Home}/>
  </Route>
)

const rootRouter = (
  <Router history={browserHistory}>
    {routes}
    {/*<Route path='bind' component={Bind} onEnter={wechatOauth}/>*/}
    <Route path='bind' component={Bind}/>
    <Route path='bind/success' component={BindSuccess}/>
    {/*<Route path='mine' component={Mine} onEnter={oauth}/>*/}
    <Route path='mine' component={Mine}/>
    <Route path='mine/wallet' component={Wallet}/>
    <Route path='mine/wallet/recharge' component={Recharge}/>
    <Route path='mine/wallet/walletDetail' component={WalletDetail}/>
    <Route path='mine/orders' component={Orders}/>
    <Route path='mine/orders/orderDetail' component={OrderDetail}/>
    <Route path='mine/score' component={Score} />
    {/*<Route path='openDevice' component={OpenDevice} onEnter={oauth}/>*/}
    <Route path='openDevice' component={OpenDevice}/>
    <Route path='modifyProfile' component={ModifyProfile}/>
    <Route path='modifyProfile/nickname' component={ModifyNickname}/>
    <Route path='modifyProfile/certification' component={Certification}/>
    <Route path='about' component={About}/>
  </Router>
)

export default rootRouter