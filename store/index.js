export const state = () => ({
  deviceType: 'pc'
})

export const mutations = {
  setDeviceType(state, type) {
    state.deviceType = type
  }
}

export const getters = {
  getDeviceType(state) {
    return state.deviceType
  }
}
