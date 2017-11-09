/**
 * Created by wanpeng on 2017/8/18.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {selectActiveUserInfo} from '../../selector/authSelector'
import './score.css'
import {WhiteSpace, Card, Flex} from 'antd-mobile'


class Score extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    document.title = " 积分"
  }

  render() {
    const {currentUser} = this.props
    return(
      <div>
        <div className="background">
          <text className="score">{currentUser.score}</text>
          <text className="scoreTrip">当前积分</text>
        </div>
        <div>
          <WhiteSpace size="lg" />
          <Card>
            <Card.Header title="积分规则" />
            <Card.Body>
              <Flex justify="between">
                <div>关注微信公众号</div>
                <div>20积分</div>
              </Flex>
              <Flex justify="between">
                <div>交押金</div>
                <div>20积分</div>
              </Flex>
              <Flex justify="between">
                <div>每充值1元</div>
                <div>1积分</div>
              </Flex>
              <Flex justify="between">
                <div>使用干衣柜</div>
                <div>1积分</div>
              </Flex>
              <Flex justify="between">
                <div>绑定手机号码</div>
                <div>10积分</div>
              </Flex>
              <Flex justify="between">
                <div>实名认证</div>
                <div>20积分</div>
              </Flex>
            </Card.Body>
          </Card>
        </div>
      </div>
    )
  }


}


const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: selectActiveUserInfo(state),
  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Score)