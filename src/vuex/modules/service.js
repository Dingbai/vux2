import { deepCopy } from '../../assets/utils/util'
// initial state
const state = {
  udcid: null,
  usermob: null,
  userkey: null,
  info: {}
}
const defaultValue = deepCopy(state)
// getters
const getters = {
  udcid: state => state.udcid,
  usermob: state => state.usermob,
  userkey: state => state.userkey,
  info: state => state.info
}
// actions
const actions = {}
// mutations
const mutations = {
  service_init (state) {
    window.$globalHub.$store.state.service = defaultValue
  },
  init_param_data (state, obj) {
    state.udcid = obj.udcid
    state.usermob = obj.usermob
    state.userkey = obj.userkey
    state.channel = obj.channel
    state.openid = obj.openid
    state.osn = obj.osn
    state.pathName = obj.pathName
  },
  init_service_data (state, obj) {
    state.info = { ...state.info, ...obj }
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
