export const state = () => ({
  content: '',
  color: '',
  time: 4000
})

export const mutations = {
  showMessage(state, payload) {
    state.content = payload.content
    state.color = payload.color
    state.time = payload.time
  }
}
