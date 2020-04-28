export const state = () => ({
  isDelete: false,
  deleted: false
})

export const mutations = {
  setIsDelete(state, isDelete) {
    state.isDelete = isDelete
  },
  setDeleted(state, isDelete) {
    state.deleted = isDelete
  }
}

export const getters = {
  getIsDelete(state) {
    return state.isDelete
  },
  getDeleted(state) {
    return state.deleted
  }
}
