// vuex/store.js
import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import config from '../../config/index'
// 导入各个模块的初始状态和 mutations
import global from './modules/global'
import sp from './modules/sp'
import log from './modules/log'
import service from './modules/service'
import localStorage from '../assets/utils/localStorage'
import auth from './modules/auth'
// 用于使用script标签加载window.Vuex，Vuex会被自动安装，无需手动安装
Vue.use(Vuex)
export default new Vuex.Store({
  // 组合各个模块
  modules: {
    global,
    sp,
    log,
    service,
    auth
  },
  // 插件
  plugins: [createPersistedState({
    key: config.build.assetsPublicPath + 'vuex',
    paths: ['log', 'service'], // 缓存模块
    getState: (key) => localStorage.get(key),
    setState: (key, state) => localStorage.set(key, state)
  })]
})
