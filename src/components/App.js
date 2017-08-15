import React from 'react'
// import { browserHistory, Router } from 'react-router'
import rootRouter from '../routes'
import { Provider } from 'react-redux'
import PropTypes from 'prop-types'

class App extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    return (
      <Provider store={this.props.store}>
        <div style={{ height: '100%' }}>
          {/*<Router history={browserHistory} children={this.props.routes} />*/}
          {rootRouter}
        </div>
      </Provider>
    )
  }
}

export default App
