export const state = () => ({
  isDark: false
})

export const mutations = {
  toggleTheme(state, isDark) {
    state.isDark = isDark
  }
}
