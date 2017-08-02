// We only need to import the modules necessary for initial render
import React from 'react'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import AppIndex from '../components/AppIndex'
import Home from '../components/Home'
import About from '../components/About'
import PromoterPerformance from '../components/Mine/promoter/PromoterPerformance'

const routes = (
  <Route path="/" component={AppIndex}>
    <IndexRoute component={Home}/>
    <Route path="about" component={About}/>
  </Route>
)

const rootRouter = (
  <Router history={browserHistory}>
    {routes}
    <Route path="promoter/performance/:promoterId" component={PromoterPerformance}/>
  </Router>
)

export default rootRouter