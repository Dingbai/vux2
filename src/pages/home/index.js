import api from '../../api/index'
import Base from '../Base/index'

export default class extends Base {
  constructor (vm) {
    super(vm)
    // 先获取用户订单状态
    if (this.appInfo()) {
      api.QueryMyOrders({
        successHanding: res => {
          this.vm.$vux.toast.show(res.Data)
        }
      })
    }
    // api.QueryMyOrders({
    //   successHanding: res => {
    //     this.vm.$vux.toast.show(res.Data)
    //   }
    // })
  }
}
