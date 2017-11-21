// BLL基类
export default class Base {
  constructor (vm) {
    this.vm = vm
    // 页面切换后自动回到顶部
    if (this.vm.$store.getters.route.path !== '/') {
      this.vm.$nextTick(() => {
        this.vm.$parent.scrollTo(0)
      })
    }
  }

  // APP版本信息，返回null则没有在APP中打开
  appInfo () {
    return this.vm.$utils.UserAgent.getInfo()
  }

  // 下载APP
  goApp (close = true) {
    if (!this.appInfo()) {
      // 埋点
      this.vm.$utils.Log.appSave('下载APP')
      setTimeout(() => {
        this.vm.$store.commit('sp_view', {
          controller: 'WebViewController',
          activity: 'BrowserActivity',
          webLink: `http://www.51pinzhi.cn/vip`,
          closeSelf: close
        })
      }, 200)
    }
  }
}
