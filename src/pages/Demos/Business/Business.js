import api from '../../../api/index'
import Base from '../../Base/index'

export default class extends Base {
  http ({ longtitude, lantitude }, op = {}) {
    api.getLocationInfo(
      { longtitude, lantitude },
      {
        successHanding: ({ Msg }) => {
          this.vm.$vux.toast.show({ text: Msg.result.formatted_address })
        },
        ...op
      }
    )
  }

  ex ({ longtitude, lantitude }) {
    api.getLocationInfo(
      { longtitude, lantitude },
      {
        options: {
          timeout: 1
        }
      }
    )
  }

  all () {
    this.vm.$vux.loading.show('加载中...')
    api.testAll(
      {
        longtitude: 118.7569226148501,
        lantitude: 31.97793035793655,
        udcid: 'VfpYC3A/933yuzKgHhCB4g=='
      },
      {
        type: 1,
        completeHanding: res => {
          this.vm.$vux.loading.hide()
          this.vm.$vux.alert.show({
            content: `接口1结果：${JSON.stringify(res[0])}<br/><br/><br/>接口2结果：${JSON.stringify(res[1])}`
          })
        },
        exceptionHandling: ex => {
          console.log('ex:', ex)
          this.vm.$vux.loading.hide()
        }
      }
    )
  }

  sequential ({ longtitude, lantitude, udcid }) {
    const op = {
      type: 2,
      completeHanding: this.vm.$vux.loading.hide
    }
    this.vm.$vux.loading.show('加载中...')
    // 调用接口1
    api.getLocationInfo(
      { longtitude, lantitude },
      {
        // validator: (res) => res.State !== 'success',
        successHanding: ({ Msg }) => {
          console.log('Msg1:', Msg)
          // 调用接口2
          api.loanCredit(udcid, {
            successHanding: ({ Msg }) => {
              this.vm.$vux.loading.hide()
              console.log('Msg2:', Msg)
            },
            ...op
          })
        },
        ...op
      }
    )
  }

  // 根据经纬度计算位置
  getLocationInfo (addressList, longtitude, lantitude) {
    api.getLocationInfo(
      { longtitude, lantitude },
      {
        successHanding: res => {
          let province = res.Msg.result.addressComponent.province
          let city = res.Msg.result.addressComponent.city
          let district = res.Msg.result.addressComponent.district
          province = addressList.find(item => {
            return item.name === province ? item : false
          })
          city = addressList.find(item => {
            return item.name === city ? item : false
          })
          district = addressList.find(item => {
            return item.name === district ? item : false
          })
          if (province && city && district) {
            this.vm.address = res.Msg.result.addressComponent.street
            this.vm.addressValue = [province.value, city.value, district.value]
          }
        }
      }
    )
  }
}
