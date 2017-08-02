/**
 * Created by yangyang on 2017/7/14.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class PromoterPerformance extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        promoter
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

export default connect(mapStateToProps, mapDispatchToProps)(PromoterPerformance)