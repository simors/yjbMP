/**
 * Created by wanpeng on 2017/8/22.
 */
import {createAction} from 'redux-actions'
import * as deviceActiontypes from '../constants/deviceActiontypes'

export const requestDeviceInfo = createAction(deviceActiontypes.FETCH_DEVICEINFO)