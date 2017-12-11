import api from '../../api/index' // eslint-disable-line
import Base from '../Base/index'

export default class extends Base {
  // constructor (vm) {
  //   super(vm)
  // }
  init () {
    // 获取udcid,usermob,userkey
    // const udcid = this.vm.$utils.Common.getParam('udcid')
    // const usermob = this.vm.$utils.Common.getParam('usermob')
    // const userkey = this.vm.$utils.Common.getParam('userkey')
    // const openid = this.vm.$utils.Common.getParam('openid')
    // let channel = this.vm.$utils.Common.getParam('channel') || 'app'
    // 区分ios 和 安卓
    // if (this.appInfo()) {
    //   if (this.vm.$device.isIphone) {
    //     channel = 'ios'
    //   } else if (this.vm.$device.isAndriod) {
    //     channel = 'and'
    //   }
    // }
    // 获取订单号
    // const osn = this.vm.$utils.Common.getParam('osn')
    // if (!udcid) {
    //   this.vm.$vux.alert.show({content: '非法链接'})
    //   return
    // }
    // 首页清除缓存
    const usermob = 'kKnJIfTAFz0gLPv5CfKN%20g%3D%3D'
    const userkey = '58992059a650c40338e8c524edd3ea24'
    const udcid = 1484568350645001
    const osn = 32102201711281457100059
    let pathName = 'path2'
    let channel = 'ios'
    this.vm.$utils.LocalStorage.clear()
    this.vm.$store.commit('service_init')
    this.vm.$store.commit('AUTH_INIT')
    this.vm.$store.commit('init_param_data', {
      udcid,
      usermob,
      userkey,
      channel,
      // openid,
      osn,
      pathName
    })
    // 生成guid
    this.vm.$store.commit('CREATED_GUID')
    if (usermob && userkey) {
      // App授权登陆
      api.oAuthByApp(
        {
          Key: userkey,
          Mobile: usermob
        },
        {
          completeHanding: () => {},
          successHanding: res => {
            // 保存auth信息
            this.vm.$store.commit('SET_AUTH', res.Data)
            this.vm.$vux.toast.show({text: res.Data})
            this.vm.$router.replace(`/myhome`)
          }
        }
      )
    } else {
      this.vm.$router.replace('/myhome')
    }
    // this.vm.$router.replace('/myhome')
  }
}
