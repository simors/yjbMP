// We only need to import the modules necessary for initial render
import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import AppIndex from '../components/AppIndex'
import Home from '../components/Home'
import About from '../components/About'
import Auth from '../components/Auth'
import BindSuccess from '../components/Auth/BindSuccess'
import Mine from '../components/Mine'
import Open from '../components/Mine/Open'
import ModifyProfile from '../components/Mine/ModifyProfile'
import {wechatOauth} from  '../util'

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
    <Route path='mine' component={Mine}/>
    <Route path='open' component={Open}/>
    <Route path='modifyProfile' component={ModifyProfile}/>
  </Router>
)

export default rootRouter