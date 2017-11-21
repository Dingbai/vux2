import api from '../../api/index' // eslint-disable-line
import Base from '../Base/index'

export default class extends Base {
  // constructor (vm) {
  //   super(vm)
  // }
  init () {
    // 获取udcid,usermob,userkey
    const udcid = this.vm.$utils.Common.getParam('udcid')
    const usermob = this.vm.$utils.Common.getParam('usermob')
    const userkey = this.vm.$utils.Common.getParam('userkey')
    // if (!udcid) {
    //   this.vm.$vux.alert.show({content: '非法链接'})
    //   return
    // }
    // 首页清除缓存
    this.vm.$utils.LocalStorage.clear()
    this.vm.$store.commit('service_init')
    this.vm.$store.commit('init_param_data', {
      userkey,
      usermob,
      udcid
    })
    // 生成guid
    this.vm.$store.commit('CREATED_GUID')
    this.vm.$router.replace('/home')
  }
}
