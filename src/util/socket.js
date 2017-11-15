/**
 * Created by yangyang on 2017/11/9.
 */
import io from 'socket.io-client'
import * as appConfig from '../constants/appConfig'

let socket = undefined

export function createSocket() {
  if (!socket) {
    socket = io(appConfig.LC_SERVER_DOMAIN, {forceNew: true})
  }
  return socket
}
