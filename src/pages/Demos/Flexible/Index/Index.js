/* eslint no-trailing-spaces: ["error", { "skipBlankLines": true }] */
// import api from '../../api/index'
import Base from '../../../Base/index'

export default class extends Base {
  constructor (vm) {
    super(vm)
    // 设置url参数
    this.urlParameters = `usermob=${this.vm.$utils.Common.getParam('usermob')}&userkey=${this.vm.$utils.Common.getParam('userkey')}`
  }
  
  init () {
    // 是否RC环境
    if (process.env.NODE_ENV === 'testing') {
      if (this.vm.$utils.Common.getParam('rc')) {
        this.vm.$utils.LocalStorage.set('rc', 1)
      } else {
        this.vm.$utils.LocalStorage.clear('rc')
      }
    }
  }
  
  link (type) {
    this.vm.$router.push('/')
  }
}
