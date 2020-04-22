export const state = () => ({
  archives: []
})

export const mutations = {
  setArchives(state, archives) {
    state.archives = archives
  },
  addArchive(state, archive) {
    state.archives.push(archive)
  }
}

export const getters = {
  getArchives(state) {
    return state.archives
  }
}
