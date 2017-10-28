/**
 * Created by yangyang on 2017/6/28.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class Home extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        Home
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)