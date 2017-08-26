/**
 * Created by wanpeng on 2017/8/25.
 */
export function selectDeviceInfo(state) {
  let DEVICE = state.DEVICE
  let device = DEVICE.device
  return device.toJS()
}