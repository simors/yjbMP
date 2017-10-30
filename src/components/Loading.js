/**
 * Created by wanpeng on 2017/10/12.
 */
import React from 'react'
import WeUI from 'react-weui'
import 'weui'
import 'react-weui/build/dist/react-weui.css'
import {ActivityIndicator} from 'antd-mobile'

export default class Loading extends React.PureComponent {
  constructor(props) {
    super(props)
  }

  render() {
    return(<ActivityIndicator toast text="正在加载" />)
  }
}