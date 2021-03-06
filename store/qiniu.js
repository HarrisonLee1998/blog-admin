export const state = () => ({
  qiniu: {}
})

export const mutations = {
  setQiniu(state, qiniu) {
    state.qiniu = qiniu
  },
  removeQiniu(state) {
    state.qiniu = {}
  }
}

export const getters = {
  getQiniu(state) {
    return state.qiniu
  }
}
