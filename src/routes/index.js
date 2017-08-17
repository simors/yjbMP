// We only need to import the modules necessary for initial render
import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import {wechatOauth} from  '../util'

import AppIndex from '../components/AppIndex'
import Home from '../components/Home'
import About from '../components/About'
import Auth from '../components/Auth'
import BindSuccess from '../components/Auth/BindSuccess'
import Mine from '../components/Mine'
import OpenDevice from '../components/Mine/OpenDevice'
import ModifyProfile from '../components/Mine/ModifyProfile'
import ModifyNickname from '../components/Mine/ModifyNickname'
import Wallet from '../components/Mine/Wallet'
import Certification from '../components/Mine/Certification'

const routes = (
  <Route path="/" component={AppIndex}>
    <IndexRoute component={Home}/>
    <Route path="about" component={About}/>
  </Route>
)

const rootRouter = (
  <Router history={browserHistory}>
    {routes}
    <Route path='auth' component={Auth} onEnter={wechatOauth}/>
    <Route path='auth/success' component={BindSuccess}/>
    <Route path='mine' component={Mine} onEnter={wechatOauth}/>
    <Route path='mine/wallet' component={Wallet} />
    <Route path='openDevice' component={OpenDevice}/>
    <Route path='modifyProfile' component={ModifyProfile}/>
    <Route path='modifyProfile/nickname' component={ModifyNickname}/>
    <Route path='modifyProfile/certification' component={Certification}/>
  </Router>
)

export default rootRouter