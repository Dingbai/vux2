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
  goCredit () {
    if (this.vm.$utils.UserAgent.getInfo()) {
      // app内提示用户获信
      const _this = this
      this.vm.$vux.confirm.show({
        content: '您还未激活品值，请先激活!',
        onCancel () {
          _this.vm.$router.push('/order')
        },
        onConfirm () {
          // 一条龙组件
          _this.vm.$store.dispatch('sp_credit', {
            udcid: _this.vm.udcid,
            type: 'ytl'
          })
        }
      })
    } else {
      const _this = this
      this.vm.$vux.alert.show({
        content: '该活动仅限已激活用户参加，赶快去激活吧!',
        onHide () {
          _this.vm.verificationCode = null
          _this.vm.phone = null
          // 下载app
          _this.goApp()
        }
      })
    }
  }
}
