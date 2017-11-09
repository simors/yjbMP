/**
 * Created by yangyang on 2017/11/9.
 */
import io from 'socket.io-client'
import * as appConfig from '../constants/appConfig'

export const socket = io(appConfig.LC_SERVER_DOMAIN, {forceNew: true})