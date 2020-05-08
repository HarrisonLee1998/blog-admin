export default ({ app, store }, inject) => {
  inject('notifier', {
    showMessage({ content = '', color = '', time = 4000 }) {
      store.commit('snackbar/showMessage', { content, color, time })
    }
  })
}
