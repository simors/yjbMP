/**
 * Created by wanpeng on 2017/10/12.
 */
/**
 * Created by yangyang on 2017/10/10.
 */
import React from 'react'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
const {Toast} = WeUI

export default class Loading extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Toast icon="loading" show={true}>加载...</Toast>
      </div>
    )
  }
}