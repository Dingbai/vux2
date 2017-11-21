// 该模块的初始状态
const state = {
  direction: 'forward',
  showTopSpace: true,
  showFoot: false,
  showMask: false,
  btnLoadingStr: null,
  btnLoadingID: null,
  seq: 0,
  route: null
}

// getters
const getters = {
  seq: state => {
    return state.seq
  },
  route: state => {
    return state.route
  },
  btnLoading: state => {
    return {
      id: state.btnLoadingID,
      str: state.btnLoadingStr
    }
  }
}

// 相关的 mutations
const mutations = {
  UPDATE_DIRECTION (state, direction) {
    state.direction = direction
  },
  SHOW_TOP_SPACE (state, showTopSpace) {
    state.showTopSpace = showTopSpace
  },
  SHOW_FOOT (state, showFoot) {
    state.showFoot = showFoot
  },
  SHOW_MASK (state, showMask) {
    state.showMask = showMask
  },
  UPDATE_BTNLOADINGSTR (state, load) {
    if (load) {
      state.btnLoadingStr = load.str
      state.btnLoadingID = load.id
      state.showMask = !!load.str
    } else {
      state.btnLoadingStr = null
      state.btnLoadingID = null
      state.showMask = false
    }
  },
  INIT_SEQ (state) {
    state.seq = 0
  },
  ADD_SEQ (state) {
    state.seq = state.seq + 1
  },
  SET_ROUTE (state, route) {
    state.route = route
  }
}

export default {
  state,
  mutations,
  getters
}
