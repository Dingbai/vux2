// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App.vue'
import { router, defaultTitle } from './router'
/**
 * sync router params
 */
import { sync } from 'vuex-router-sync'
import store from './vuex/store'
// plugins
import { AlertPlugin, ConfirmPlugin, DevicePlugin, LoadingPlugin, ConfigPlugin } from 'vux'
import ToastPlugin from './plugs/toast/index'
import UtilsPlugin from './assets/utils'
import HttpPlugin from './http'
// polyfill
import './polyfill/index'
Vue.use(VueRouter)
FastClick.attach(document.body)
let history = window.sessionStorage
history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)
/**
 * sync router loading status
 */
const commit = store.commit
router.beforeEach((to, from, next) => {
  commit('SHOW_MASK', true)
  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)
  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      commit('UPDATE_DIRECTION', 'forward')
    } else {
      commit('UPDATE_DIRECTION', 'reverse')
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    commit('UPDATE_DIRECTION', 'forward')
  }
  commit('SHOW_FOOT', false)
  setTimeout(next, 50)
})
router.afterEach(to => {
  // 设置标题
  if (to.meta.title || defaultTitle !== document.title) {
    Vue.$utils.Common.setTitle(to.meta.title || defaultTitle)
  }
  // 默认页面头部留2%高度的余白，不需要的页面需设置meta.noTopSpace = true
  commit('SHOW_TOP_SPACE', !to.meta.noTopSpace)
  // 保存当前路由
  commit('SET_ROUTE', to)
  if (!to.meta.noRouterLog) {
    // 统计
    setTimeout(() => {
      Vue.$utils.Log.appRouter()
    }, 500)
  }
})
sync(store, router)
Vue.use(DevicePlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)
Vue.use(UtilsPlugin)
Vue.use(ToastPlugin)
Vue.use(HttpPlugin)
Vue.use(ConfigPlugin, {
  $layout: 'VIEW_BOX'
})
// weixin jssdk
// todo 如果不需要使用微信jssdk相关功能，请注释下面的语句
// if (Vue.$device.isWechat) {
//   Vue.$utils.WeiXin.init(() => {
//     Vue.$vux.loading.show('微信初始化中')
//   }, () => {
//     Vue.$vux.loading.hide()
//   })
// }
// global
window.$globalHub = new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')

