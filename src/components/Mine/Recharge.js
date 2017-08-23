/**
 * Created by wanpeng on 2017/8/18.
 */
import React, {Component} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import './recharge.css'

const {
  Button,
  ButtonArea,
  Panel,
  Page,
  PanelHeader,
  PanelBody,
  MediaBox,
  MediaBoxTitle,
  MediaBoxDescription,
} = WeUI

class Recharge extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectAmount: 20,
    }
  }

  componentDidMount() {
    document.title = "充值"
  }

  changeAmount(amount) {
    this.setState({
      selectAmount: amount
    })
  }

  getTripText() {
    switch (this.state.selectAmount) {
      case 10:
        return "您选择了“充10元得20元”"
        break
      case 20:
        return "您选择了“充20元得50元”"
        break
      case 30:
        return "您选择了“充30元得80元”"
        break
      case 50:
        return "您选择了“充50元得120元”"
        break
      case 100:
        return "您选择了“充100元得260元”"
        break
      case 200:
        return "您选择了“充200元得500元”"
        break
      default:
        break
    }
  }

  getTripDesc() {
    switch (this.state.selectAmount) {
      case 10:
        return "本次充值后，账户会增加20元，其中10元赠款不可退。"
        break
      case 20:
        return "本次充值后，账户会增加50元，其中30元赠款不可退。"
        break
      case 30:
        return "本次充值后，账户会增加80元，其中50元赠款不可退。"
        break
      case 50:
        return "本次充值后，账户会增加120元，其中80元赠款不可退。"
        break
      case 100:
        return "本次充值后，账户会增加260元，其中160元赠款不可退。"
        break
      case 200:
        return "本次充值后，账户会增加500元，其中300元赠款不可退。"
        break
      default:
        break
    }
  }

  render() {
    return(
      <Page>
        <div className="banner">
        </div>
        <div className="button-area">
          <ButtonArea direction='horizontal'>
            <Button plain={this.state.selectAmount != 10} className='amountButton' onClick={() => this.changeAmount(10)}>充10元得20元</Button>
            <Button plain={this.state.selectAmount != 20} className='amountButton' onClick={() => this.changeAmount(20)}>充20元得50元</Button>
          </ButtonArea>
          <ButtonArea direction='horizontal'>
            <Button plain={this.state.selectAmount != 30} className='amountButton' onClick={() => this.changeAmount(30)}>充30元得80元</Button>
            <Button plain={this.state.selectAmount != 50} className='amountButton' onClick={() => this.changeAmount(50)}>充50元得120元</Button>
          </ButtonArea>
          <ButtonArea direction='horizontal'>
            <Button plain={this.state.selectAmount != 100} className='amountButton' onClick={() => this.changeAmount(100)}>充100元得260元</Button>
            <Button plain={this.state.selectAmount != 200} className='amountButton' onClick={() => this.changeAmount(200)}>充200元得500元</Button>
          </ButtonArea>
        </div>
        <div className="trip">
          <text className="tripTitle">{this.getTripText()}</text>
          <text className="tripDesc">{this.getTripDesc()}</text>
        </div>
        <div className="rechargeButton">
          <Button>{"充值" + this.state.selectAmount + '元'}</Button>
        </div>
      </Page>
    )
  }

}

const mapStateToProps = (state, ownProps) => {
  return {

  }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Recharge)