// We only need to import the modules necessary for initial render
import React from 'react'
import { Router, Route, IndexRoute, browserHistory} from 'react-router'
import { wechatOauth, setInitUrl} from  '../util'

import AppIndex from '../components/AppIndex'
import Home from '../components/Home'
import About from '../components/About'
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
import Deposit from '../components/Mine/Deposit'
import Refund from '../components/Mine/Refund'
import LoadingPage from '../components/Loading/'
import AuthSuccess from '../components/Auth/AuthSuccess'
import Focus from '../components/Focus'
import Result from '../components/Result'


const routes = (
  <Route path="/" component={AppIndex}>
    <IndexRoute component={Home}/>
  </Route>
)

const rootRouter = (
  <Router history={browserHistory}>
    {routes}
    <Route path='bind' component={Bind}/>
    <Route path='mine' component={Mine} onEnter={wechatOauth}/>
    <Route path='mine/wallet' component={Wallet} onEnter={wechatOauth}/>
    <Route path='mine/wallet/recharge' component={Recharge}/>
    <Route path='mine/wallet/walletDetail' component={WalletDetail}/>
    <Route path='mine/orders' component={Orders} onEnter={wechatOauth}/>
    <Route path='mine/orders/:id' component={OrderDetail}/>
    <Route path='mine/score' component={Score} onEnter={wechatOauth}/>
    <Route path='mine/deposit' component={Deposit} />
    <Route path='mine/refund' component={Refund} />
    <Route path='openDevice/:deviceNo' component={OpenDevice} onEnter={wechatOauth}/>
    <Route path='modifyProfile' component={ModifyProfile}/>
    <Route path='modifyProfile/nickname' component={ModifyNickname}/>
    <Route path='modifyProfile/certification' component={Certification}/>
    <Route path='about' component={About}/>
    <Route path='loading' component={LoadingPage} onEnter={setInitUrl}/>
    <Route path='focus' component={Focus} />
    <Route path='authSuccess' component={AuthSuccess} onEnter={wechatOauth}/>
    <Route path='result/:title/:type' component={Result}/>
  </Router>
)

export default rootRouter