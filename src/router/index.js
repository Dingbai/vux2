import Vue from 'vue'
import Router from 'vue-router'
import config from '../../config/index'
// 生产/测试环境，使用路由懒加载
const view =
  process.env.NODE_ENV === 'development'
    ? file => require(`@/pages/${file}.vue`).default
    : file => () => System.import(`@/pages/${file}.vue`).then(m => m.default)
Vue.use(Router)
// meta 特殊标记
// 通用
//  title：网页title，noFoot：不展示底部，noTopSpace：不展示头部余白
// 埋点用
//  name：页面名称，modeName：流程名，noRouterLog：不记录路由卖点（跳转页使用）
export const defaultTitle = 'vux模版项目'
export const router = new Router({
  mode: 'history', // 后端支持可开
  base: config.build.assetsPublicPath,
  routes: [
    { path: '*', component: view('404/404'), name: '404', meta: { noFoot: true, noTopSpace: true, noRouterLog: true } },
    { path: '/', component: view('Index/Index'), meta: { noFoot: true, noTopSpace: true, noRouterLog: true } },
    { path: '/home', component: view('Demos/Home'), meta: { noFoot: true, noTopSpace: true } },
    { path: '/demo/button', component: view('Demos/Button'), meta: { title: '按钮', noFoot: true, noTopSpace: true } },
    { path: '/dialog', component: view('Demos/Dialog') },
    { path: '/utils', component: view('Demos/Utils') },
    { path: '/load', component: view('Demos/PulldownPullup') },
    { path: '/http', component: view('Demos/Business/Business') },
    { path: '/input', component: view('Demos/Input') },
    { path: '/sp', component: view('Demos/SpApi') },
    { path: '/wx', component: view('Demos/Wexin') },
    { path: '/infiniteLoading', component: view('Demos/InfiniteLoading') },
    { path: '/flexible', component: view('Demos/Flexible/Index/Index'), meta: { noTopSpace: true, noFoot: true } },
    { path: '/sku', component: view('Demos/Sku/Index') },
    { path: '/tcy', component: view('Demo_tcy/thuesday') },
    { path: '/testcom', component: view('Demo_tcy/test_componets') },
    { path: '/testget', component: view('Demos/Tcy/Tcy') }
  ]
})
