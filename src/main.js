import React from 'react'
import ReactDOM from 'react-dom'
import {store} from './store/persistStore'
import AV from 'leancloud-storage'
import * as appConfig from './constants/appConfig'
import './styles/main.scss'

//leancloud init
AV.init(appConfig.LC_APP_ID, appConfig.LC_APP_KEY)

// Render Setup
// ------------------------------------
const MOUNT_NODE = document.getElementById('root')

let render = () => {
  const App = require('./components/App').default
  // const routes = require('./routes/index').default

  ReactDOM.render(
    <App store={store} />,
    MOUNT_NODE
  )
}

// Development Tools
// ------------------------------------
if (__DEV__) {
  if (module.hot) {
    const renderApp = render
    const renderError = (error) => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    render = () => {
      try {
        renderApp()
      } catch (e) {
        console.error(e)
        renderError(e)
      }
    }

    // Setup hot module replacement
    module.hot.accept([
      './components/App',
      './routes/index',
    ], () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

// Let's Go!
// ------------------------------------
if (!__TEST__) render()
