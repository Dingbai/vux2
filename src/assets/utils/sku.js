let skuResult = {}
let selectedTemp = {} // 存放被选中的attribute
let ids = 1000
let maps = {}
let stocks, attributes

function initDatas (s, a) {
  a.forEach((m) => {
    m.childAttr = m.values.map(x => {
      maps[x] = ids++
      return {
        name: x,
        id: maps[x].toString()
      }
    })
  })
  s.forEach(x => {
    x.attribute = x.datas.map(y => {
      return {
        name: y.name,
        childAttr: {
          name: y.value,
          id: maps[y.value].toString()
        }
      }
    })
  })
  stocks = s
  attributes = a
}

export default {
  init (s, a, filterCount0 = false) {
    initDatas(s, a)
    const data = stocks.reduce((obj, item) => {
      const object = Object.assign({}, obj)
      const total = item.attribute.reduce((arr, m) => {
        arr.push(m.childAttr.id)
        return arr
      }, [])
      total.sort((value1, value2) => parseInt(value1, 10) - parseInt(value2, 10))
      object[total.join(';')] = Object.assign({}, item)
      return object
    }, {})
    const SKUResult = {}
    let skuKeys
    if (filterCount0) {
      // 需要剔除count为 0 的库存
      skuKeys = Object.keys(data).reduce((arr, key) => {
        if (data[key].count > 0) {
          arr.push(key)
        }
        return arr
      }, [])
    } else {
      skuKeys = Object.keys(data).map((key) => key)
    }
    skuKeys.forEach((skuKey) => {
      const sku = data[skuKey]
      const skuKeyAttrs = skuKey.split(';')
      const combArr = this.arrayCombine(skuKeyAttrs)
      for (let j = 0; j < combArr.length; j++) {
        const key = combArr[j].join(';')
        if (SKUResult[key]) {
          SKUResult[key].count += sku.count
          SKUResult[key].prices.push(sku.price)
        } else {
          SKUResult[key] = {
            count: sku.count,
            prices: [sku.price],
            id: [sku.id],
            skuid: sku.skuid
          }
        }
      }
      SKUResult[skuKey] = {
        count: sku.count,
        prices: [sku.price],
        id: [sku.id],
        skuid: sku.skuid
      }
    })
    skuResult = SKUResult
  },
  render () {
    let rAttributes = []
    let rPrice = null
    let rCount = null
    let rSkuid = null
    // const attributes = this.vm.attributes
    // 根据已选中的selectedTemp，生成字典查询selectedIds
    const selectedIds = Object.keys(selectedTemp).reduce((arr, m) => {
      if (selectedTemp[m]) {
        arr.push(selectedTemp[m].id)
      }
      return arr
    }, [])
    selectedIds.sort((value1, value2) => parseInt(value1, 10) - parseInt(value2, 10))
    // 处理attributes数据，根据字典查询结果计算当前选择情况的价格范围以及总数量。
    // 并添加selected属性，用于render判断。
    attributes.forEach((m) => {
      let selectedObjId
      m.childAttr.forEach((a) => {
        a.selected = !!(selectedTemp[m.name] && selectedTemp[m.name].id === a.id)
        if (!a.selected) {
          let testAttrIds = []
          if (selectedTemp[m.name]) {
            selectedObjId = selectedTemp[m.name].id
            for (let i = 0; i < selectedIds.length; i++) {
              (selectedIds[i] !== selectedObjId) && testAttrIds.push(selectedIds[i])
            }
          } else {
            testAttrIds = selectedIds.concat()
          }
          testAttrIds = testAttrIds.concat(a.id)
          testAttrIds.sort((value1, value2) => parseInt(value1, 10) - parseInt(value2, 10))
          a.unselectable = !skuResult[testAttrIds.join(';')]
        }
      })
      rAttributes.push(m)
    })
    if (skuResult[selectedIds.join(';')]) {
      const prices = skuResult[selectedIds.join(';')].prices
      const max = Math.max.apply(Math, prices)
      const min = Math.min.apply(Math, prices)
      rPrice = max === min ? max : `${min}~${max}`
      if (selectedIds.length === attributes.length) {
        rPrice = skuResult[selectedIds.join(';')].prices[0]
        rSkuid = skuResult[selectedIds.join(';')].skuid
      }
      rCount = skuResult[selectedIds.join(';')].count
    } else {
      rPrice = `${Math.min.apply(Math, stocks.map(x => x.price))}~${Math.max.apply(Math, stocks.map(x => x.price))}`
      rCount = stocks.reduce((count, item) => count + item.count, 0)
    }
    return {attributes: rAttributes, count: rCount, price: rPrice, skuid: rSkuid}
  },
  click (attributes, item) {
    attributes.forEach((info) => {
      if (selectedTemp[info.name] && selectedTemp[info.name].id === item.id) {
        selectedTemp[info.name] = null
      } else {
        info.childAttr.forEach((c) => {
          if (c.id === item.id) {
            c.selected = false
            selectedTemp[info.name] = {}
            selectedTemp[info.name].name = c.name
            selectedTemp[info.name].id = c.id
          }
        })
      }
    })
  },
  arrayCombine (targetArr) {
    if (!targetArr || !targetArr.length) {
      return []
    }
    const len = targetArr.length
    const resultArrs = []
    for (let n = 1; n < len; n++) {
      const flagArrs = this.getFlagArrs(len, n)
      while (flagArrs.length) {
        const flagArr = flagArrs.shift()
        const combArr = targetArr.reduce((combArr, m, index) => {
          flagArr[index] && combArr.push(m)
          return combArr
        }, [])
        resultArrs.push(combArr)
      }
    }
    return resultArrs
  },
  getFlagArrs (m, n) {
    if (!n || n < 1) {
      return []
    }
    const resultArrs = []
    const flagArr = []
    let isEnd = false
    let leftCnt
    for (let i = 0; i < m; i++) {
      flagArr[i] = i < n ? 1 : 0
    }
    resultArrs.push(flagArr.concat())
    while (!isEnd) {
      leftCnt = 0
      for (let i = 0; i < m - 1; i++) {
        if (flagArr[i] === 1 && flagArr[i + 1] === 0) {
          for (let j = 0; j < i; j++) {
            flagArr[j] = j < leftCnt ? 1 : 0
          }
          flagArr[i] = 0
          flagArr[i + 1] = 1
          const aTmp = flagArr.concat()
          resultArrs.push(aTmp)
          if (aTmp.slice(-n).join('').indexOf('0') === -1) {
            isEnd = true
          }
          break
        }
        flagArr[i] === 1 && leftCnt++
      }
    }
    return resultArrs
  }
}
