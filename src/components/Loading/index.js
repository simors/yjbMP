/**
 * Created by yangyang on 2017/9/21.
 */
import React from 'react'
import {connect} from 'react-redux'
import {browserHistory} from 'react-router'
import Loading from '../Loading'
import {selectIsRehydrated} from '../../selector/configSelector'

class LoadingPage extends React.Component {
  constructor(props) {
    super(props)
  }

  componentWillReceiveProps(newProps) {
    const { from } = this.props.location.state || { from: { pathname: '/' } }
    let {isRehydrated} = newProps
    if (isRehydrated) {
      browserHistory.replace(from)
    }
  }

  render() {
    return (
      <Loading/>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    isRehydrated: selectIsRehydrated(state),
  }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadingPage)
