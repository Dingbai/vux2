/* eslint no-trailing-spaces: ["error", { "skipBlankLines": true }] */
// import api from '../../api/index'
import Base from '../../Base/index'
import sku from '../../../assets/utils/sku'
import stocks from './stocks.json'
import attributes from './attributes.json'

export default class extends Base {
  // constructor (vm) {
  //   super(vm)
  // }
  init () {
    attributes.forEach(x => {
      x.value = null
    })
    sku.init(stocks, attributes, true)
  }
  
  // 处理sku数据
  skuHandler () {
    let result = sku.render()
    this.vm.attributes = result.attributes
    this.vm.count = result.count
    this.vm.price = result.price
    this.vm.skuid = result.skuid
  }
  
  clickHandler (item) {
    sku.click(this.vm.attributes, item)
    // 重新渲染
    this.skuHandler()
  }
}
