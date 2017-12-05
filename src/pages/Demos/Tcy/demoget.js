import api from '../../../api/index'
export default class Demo {
  constructor (vm) {
    this.vm = vm
    // this.vm.$http.get('/douBan/v2/book/' + this.vm.index)
    //   .then(function (response) {
    //     this.detail = response
    //   })
    //   .catch(function (err) {
    //     console.log(err)
    //   })
    api.getdouban(this.vm.index, {
      successHanding: (res) => {
        this.vm.$vux.alert.show({ content: res })
      }
    })
  }
  showloading () {
    this.vm.$vux.toast.show({ text: '正在加载' })
    this.vm.$vux.loading.show('正字加载')
    setTimeout(() => {
      this.vm.$vux.loading.hide()
    }, 1000)
  }
  nextPage () {
    setTimeout(() => {
      this.vm.$vux.alert.show({content: 'test!'})
    }, 100)
  }
  testClass () {
    this.vm.$vux.toast.show({text: 'class'})
  }
  mutilApi (id) {
    api.getLocationInfo(
      {
        longtitude: 118.7569226148501,
        lantitude: 31.97793035793655
      },
      {
        load: 'btn',
        loadMsg: '正在查询',
        loadID: id,
        successHanding: ({ Msg }) => {
          this.vm.$vux.toast.show({ text: Msg.result.formatted_address })
        }
      }
    )
  }
}
