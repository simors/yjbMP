/**
 * Created by yangyang on 2017/6/28.
 */
export function selectLocation(state) {
  let config = state.CONFIG
  let location = config.location
  if (location) {
    return location.toJS()
  }
  return undefined
}

export function selectIsRehydrated(state) {
  let isRehydrated = state.CONFIG.get('isRehydrated')
  return isRehydrated
}