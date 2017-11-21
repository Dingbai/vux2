import Vue from 'vue'
// region SpApi Init
// eslint-disable-next-line
connectWebViewJavascriptBridge(function(bridge) {
  // eslint-disable-next-line
  if (ifOldBridge()) {
    bridge.init(function (message, responseCallback) {})
  }
  // 上传身份证正反面回调z
  bridge.registerHandler('BridgeUploadSuccess', function (data, responseCallback) {
    window.$globalHub.$store.commit('setIdCardInfo', { ...state.idCardInfo, ...data })
  })
  // 读取通讯录回调
  bridge.registerHandler('BridgeContactSuccess', function (data, responseCallback) {
    if (data === 'success') {
      window.WebViewJavascriptBridge.callHandler('open_user_contacts', '', function (response) {
        window.$globalHub.$store.commit('setContactInfo', { readOnly: false, ...response })
      })
    }
  })
  // 支付宝、微信回调
  bridge.registerHandler('BridgePaySuccess', function (data, responseCallback) {
    if (data === 'success') {
      window.$globalHub.$store.commit('setAlipayCallBackData', { State: 'success' })
    } else {
      window.$globalHub.$store.commit('setAlipayCallBackData', { State: 'fail' })
    }
  })
})
// endregion
// initial state
const state = {
  payCallBackData: null,
  faceCallBackData: null,
  shareCallBackData: null,
  zmxyCallBackData: null,
  creditCallBackData: null,
  alipayCallBackData: null,
  refreshCallBackData: null,
  bankcard: null,
  addressCallBackData: {
    openLocation: false,
    longtitude: 0,
    lantitude: 0
  },
  contactInfo: {
    name: '',
    phone: '',
    readOnly: true
  },
  idCardInfo: null
}
// getters
const getters = {
  payCallBackData: state => state.payCallBackData,
  faceCallBackData: state => state.faceCallBackData,
  shareCallBackData: state => state.shareCallBackData,
  zmxyCallBackData: state => state.zmxyCallBackData,
  creditCallBackData: state => state.creditCallBackData,
  alipayCallBackData: state => state.alipayCallBackData,
  refreshCallBackData: state => state.refreshCallBackData,
  addressCallBackData: state => state.addressCallBackData
}
// 相关的 mutations
const mutations = {
  // 刷新并关闭
  sp_refresh_close (state) {
    if (process.env.NODE_ENV !== 'development') {
      // 生产环境
      Vue.$vux.loading.show('加载中...')
      if (window.ifNewVersion()) {
        // 刷新主页
        window.WebViewJavascriptBridge.callHandler('pz_refresh_homepage', '', function (response) {
          // 关闭当前页面
          let jsonData = {
            controller: 'UIViewController',
            activity: ''
          }
          window.WebViewJavascriptBridge.callHandler('pz_popto', jsonData, function (response) {})
        })
      } else {
        if (Vue.$device['isIphone']) {
          window.WebViewJavascriptBridge.callHandler('refresh_home_page', '', function (response) {
            window.WebViewJavascriptBridge.callHandler('moral_popto', 'UIViewController', function (response) {})
          })
        } else {
          window.MoralAPI.Refresh()
          setTimeout(() => {
            window.MoralAPI.moral_popto('y')
          }, 2000)
        }
      }
    } else {
      console.log('sp_refresh_close')
    }
  },
  // 刷新
  sp_refresh (state) {
    if (process.env.NODE_ENV !== 'development' && Vue.$utils.UserAgent.getInfo()) {
      // 生产环境
      if (window.ifNewVersion()) {
        // 刷新主页
        window.WebViewJavascriptBridge.callHandler('pz_refresh_homepage', '', function (response) {})
      } else {
        if (Vue.$device['isIphone']) {
          window.WebViewJavascriptBridge.callHandler('refresh_home_page', '', function (response) {})
        } else {
          window.MoralAPI.Refresh()
        }
      }
    } else {
      console.log('sp_refresh')
    }
  },
  // 关闭
  sp_close_only (state) {
    if (process.env.NODE_ENV !== 'development') {
      // 生产环境
      if (window.ifNewVersion()) {
        let jsonData = {
          controller: 'UIViewController',
          activity: ''
        }
        window.WebViewJavascriptBridge.callHandler('pz_popto', jsonData, function (response) {})
      } else {
        if (Vue.$device['isIphone']) {
          window.WebViewJavascriptBridge.callHandler('moral_popto', 'UIViewController', function (response) {})
        } else {
          window.MoralAPI.moral_popto('y')
        }
      }
    } else {
      console.log('exit')
    }
  },
  // 弹出控制器
  sp_view (state, { controller, activity, webLink = '', closeSelf = false }) {
    if (process.env.NODE_ENV !== 'development') {
      // 生产环境
      const jsonData = {
        Controller: controller,
        Activity: activity,
        webLink: webLink,
        closeSelf: closeSelf
      }
      // 生产环境
      if (window.ifNewVersion()) {
        window.WebViewJavascriptBridge.callHandler('pz_view', jsonData, function (response) {})
      } else {
        if (Vue.$device['isIphone']) {
          window.WebViewJavascriptBridge.callHandler('moral_view', jsonData, function (response) {})
        } else {
          window.MoralAPI.moral_view(jsonData.Activity, jsonData.webLink, jsonData.closeSelf)
        }
      }
    } else {
      console.log(controller, activity)
    }
  },
  // 弹出控制器（指定参数）
  sp_view_param (state, { controller, activity, typeid }) {
    if (process.env.NODE_ENV !== 'development') {
      // 生产环境
      if (window.ifNewVersion()) {
        const jsonData = {
          controller: controller,
          activity: activity,
          typeid: typeid
        }
        window.WebViewJavascriptBridge.callHandler('pz_view', jsonData, function (response) {})
      } else {
        const jsonData = {
          Controller: controller,
          Activity: activity,
          typeid: typeid
        }
        if (Vue.$device['isIphone']) {
          window.WebViewJavascriptBridge.callHandler('moral_view', jsonData, function (response) {})
        } else {
          window.MoralAPI.moral_viewnew(JSON.stringify(jsonData))
        }
      }
    } else {
      console.log(controller, activity, typeid)
    }
  },
  // region setCallBackValue
  setPayCallBackData (state, data) {
    state.payCallBackData = data
  },
  setBankCard (state, data) {
    state.bankcard = data
  },
  setContactInfo (state, data) {
    if (data && data.phone) {
      data.phone = data.phone.replace(/\D/g, '')
    }
    state.contactInfo = data
  },
  setIdCardInfo (state, data) {
    let temp = {}
    // 正面照回调
    if (data.rk1) {
      temp.name = data.name
      temp.id_card_number = data.id_card_number
      temp.address = data.address
      temp.rk1 = data.rk1
    }
    // 背面照回调
    if (data.rk2) {
      temp.rk2 = data.rk2
      temp.valid_date = data.valid_date
    }
    state.idCardInfo = { ...state.idCardInfo, ...temp }
  },
  setFaceCallBackData (state, data) {
    state.faceCallBackData = data
  },
  setZmxyCallBackData (state, data) {
    state.zmxyCallBackData = data
  },
  setCreditCallBackData (state, data) {
    state.creditCallBackData = data
  },
  setAlipayCallBackData (state, data) {
    state.alipayCallBackData = data
  },
  setRefreshCallBackData (state, data) {
    state.refreshCallBackData = data
  },
  setShareCallBackData (state, data) {
    state.shareCallBackData = data
  },
  setOpenLocation (state, data) {
    state.openLocation = data
  },
  setAddressCallBackData (state, response) {
    if (response.State.toLowerCase() === 'success') {
      state.addressCallBackData = {
        openLocation: true,
        longtitude: response.longitude,
        lantitude: response.latitude
      }
    } else {
      if (response.Code === 0) {
        state.addressCallBackData = {
          openLocation: true,
          longtitude: 0,
          lantitude: 0
        }
        Vue.$vux.alert.show({ content: '定位失败，请手动选择常住地区' })
      } else {
        Vue.$vux.alert.show({ content: '请在系统设置中打开定位服务' })
      }
    }
  }
  // endregion
}
// actions
const actions = {
  // 调用支付密码
  sp_paykey ({ commit, state }) {
    if (process.env.NODE_ENV !== 'development') {
      // 生产环境
      if (window.ifNewVersion()) {
        window.WebViewJavascriptBridge.callHandler('pz_paykey', '', function (response) {
          commit('setPayCallBackData', response)
        })
      } else {
        if (Vue.$device['isIphone']) {
          window.WebViewJavascriptBridge.callHandler('moral_paykey', '', function (response) {
            commit('setPayCallBackData', response)
          })
        } else {
          window.MoralAPI.moral_paykey()
        }
      }
    } else {
      // 测试环境
      commit('setPayCallBackData', { State: 'success' })
    }
  },
  // 设置支付密码
  sp_view_trpassword ({ commit, state }) {
    if (process.env.NODE_ENV !== 'development') {
      // 生产环境
      if (window.ifNewVersion()) {
        let jsonData = {
          controller: 'BusinessPwdController2',
          activity: 'SettingTrPasswordActivity'
        }
        window.WebViewJavascriptBridge.callHandler('pz_view', jsonData, function (msg) {
          let response = {
            State: 'success',
            Msg: { ...msg }
          }
          commit('setPayCallBackData', response)
        })
      } else {
        if (Vue.$device['isIphone']) {
          window.WebViewJavascriptBridge.callHandler('moral_view', 'BusinessPwdController2', function (msg) {
            let response = {
              State: 'success',
              Msg: { ...msg }
            }
            commit('setPayCallBackData', response)
          })
        } else {
          window.MoralAPI.moral_view('SettingTrPasswordActivity')
        }
      }
    } else {
      // 测试环境
      commit('setPayCallBackData', { State: 'success' })
    }
  },
  // 识别银行卡
  sp_get_cardnum ({ commit, state }) {
    if (process.env.NODE_ENV !== 'development') {
      // 生产环境
      if (window.ifNewVersion()) {
        window.WebViewJavascriptBridge.callHandler('pz_get_cardnum', '', function (response) {
          commit('setBankCard', response)
        })
      } else {
        if (Vue.$device['isIphone']) {
          window.WebViewJavascriptBridge.callHandler('moral_bankcard', '', function (response) {
            commit('setBankCard', response)
          })
        } else {
          window.MoralAPI.moral_view('CardIOActivity')
        }
      }
    } else {
      // 测试环境
      commit('setBankCard', '6225750007493535')
    }
  },
  // 获取地理位置
  sp_get_location ({ commit, state }) {
    if (process.env.NODE_ENV !== 'development') {
      // 生产环境
      if (window.ifNewVersion()) {
        window.WebViewJavascriptBridge.callHandler('pz_get_location', '', function (response) {
          commit('setAddressCallBackData', response)
        })
      } else {
        if (Vue.$device['isIphone']) {
          window.WebViewJavascriptBridge.callHandler('get_user_location', '', function (response) {
            commit('setAddressCallBackData', response)
          })
        } else {
          window.MoralAPI.moral_location()
        }
      }
    } else {
      // 测试环境
      commit('setAddressCallBackData', {
        State: 'Success',
        longitude: 118.7569226148501,
        latitude: 31.97793035793655
      })
      // commit('setAddressCallBackData', {
      //   'State': 'fail', 'Code': 0
      // })
    }
  },
  // 读取通讯录
  sp_choose_contact ({ commit, state }) {
    if (process.env.NODE_ENV !== 'development') {
      // 生产环境
      if (window.ifNewVersion()) {
        window.WebViewJavascriptBridge.callHandler('pz_upload_contact', '', function (response) {
          if (response.State === 'success') {
            window.WebViewJavascriptBridge.callHandler('pz_choose_contact', '', function (response) {
              commit('setContactInfo', { readOnly: false, ...response })
            })
          }
        })
      } else {
        if (Vue.$device['isIphone']) {
          window.WebViewJavascriptBridge.callHandler('moral_contact', '', function (response) {})
        } else {
          window.MoralAPI.getContacts()
        }
      }
    } else {
      // 测试环境
      let response = { name: '哈哈', phone: '18652818961' }
      commit('setContactInfo', { readOnly: false, ...response })
    }
  },
  // 识别身份证正反面
  sp_idcard_recognition ({ commit, state }, type) {
    if (process.env.NODE_ENV !== 'development') {
      // 生产环境
      if (window.ifNewVersion()) {
        window.WebViewJavascriptBridge.callHandler('pz_idcard_recognition', type, function (response) {
          if (response.State.toLowerCase() === 'success') {
            commit('setIdCardInfo', { ...state.idCardInfo, ...response.Msg })
          }
        })
      } else {
        if (Vue.$device['isIphone']) {
          window.WebViewJavascriptBridge.callHandler('idcard_recognition', type, function (response) {})
        } else {
          window.MoralAPI.identifyID(type)
        }
      }
    } else {
      // 测试环境
      let response
      if (type === 0) {
        response = {
          rk1: 'http://www.sznews.com/ent/images/attachement/jpg/site3/20141011/4437e629783815a2bce253.jpg',
          address: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈',
          name: '哈哈',
          id_card_number: '321102198609061015'
        }
      } else {
        response = {
          rk2: 'http://epaper.cnsq.com.cn/jjwb/res/1/10/2011-01/07/06/res01_attpic_brief.jpg',
          valid_date: '2020-03-15'
        }
      }
      commit('setIdCardInfo', { ...state.idCardInfo, ...response })
    }
  },
  // 人脸识别
  sp_view ({ commit, state }) {
    if (process.env.NODE_ENV !== 'development') {
      // 生产环境
      if (window.ifNewVersion()) {
        window.WebViewJavascriptBridge.callHandler(
          'pz_view',
          {
            controller: 'FacePlusController',
            activity: 'LivenessActivity'
          },
          function (response) {
            commit('setFaceCallBackData', response)
          }
        )
      } else {
        if (Vue.$device['isIphone']) {
          window.WebViewJavascriptBridge.callHandler('moral_view', 'FacePlusController', function (response) {
            commit('setFaceCallBackData', response)
          })
        } else {
          window.MoralAPI.moral_view('LivenessActivity')
        }
      }
    } else {
      // 测试环境
      commit('setFaceCallBackData', { State: 'success' })
    }
  },
  // 分享
  sp_share ({ commit, state }, { title, desc, icon, link }) {
    if (process.env.NODE_ENV !== 'development') {
      // 生产环境
      if (window.ifNewVersion()) {
        const jsonData = {
          title: title,
          desc: desc,
          icon: icon,
          link: link,
          snsType: 0,
          snsName: '0'
        }
        window.WebViewJavascriptBridge.callHandler('pz_share', jsonData, function (response) {
          commit('setShareCallBackData', { State: 'success' })
        })
      } else {
        const jsonData = {
          title: title,
          desc: desc,
          icon: icon,
          link: link
        }
        if (Vue.$device['isIphone']) {
          window.WebViewJavascriptBridge.callHandler('moral_share', jsonData, function (response) {
            commit('setShareCallBackData', { State: 'success' })
          })
        } else {
          window.MoralAPI.moral_share(jsonData.title, jsonData.desc, jsonData.icon, jsonData.link)
        }
      }
    } else {
      // 测试环境
      console.log('share')
      commit('setShareCallBackData', { State: 'success' })
    }
  },
  // 分享
  sp_share_simple ({ commit, state }, shareInfo) {
    if (process.env.NODE_ENV !== 'development') {
      // 生产环境
      if (window.ifNewVersion()) {
        window.WebViewJavascriptBridge.callHandler('pz_share', shareInfo, function (response) {
          commit('setShareCallBackData', { State: 'success' })
        })
      } else {
        if (Vue.$device['isIphone']) {
          window.WebViewJavascriptBridge.callHandler('moral_share', shareInfo, function (response) {
            commit('setShareCallBackData', { State: 'success' })
          })
        } else {
          window.MoralAPI.moral_share(
            shareInfo.title,
            shareInfo.desc,
            shareInfo.icon,
            shareInfo.link,
            shareInfo.snsName
          )
        }
      }
    } else {
      console.log('share')
      commit('setShareCallBackData', { State: 'success' })
    }
  },
  // 芝麻信用
  sp_zmxy ({ commit, state }, { name, idcard }) {
    let jsonData = {
      name,
      idcard,
      identitytype: 2
    }
    if (process.env.NODE_ENV !== 'development') {
      // 生产环境
      if (window.ifNewVersion()) {
        window.WebViewJavascriptBridge.callHandler('pz_zmxy', jsonData, function (response) {
          commit('setZmxyCallBackData', response)
        })
      } else {
        if (Vue.$device['isIphone']) {
          window.WebViewJavascriptBridge.callHandler('moral_zmxy', jsonData, function (response) {
            commit('setZmxyCallBackData', response)
          })
        } else {
          window.MoralAPI.moral_zmxy(jsonData.name, jsonData.idcard, jsonData.identitytype)
        }
      }
    } else {
      // 测试环境
      commit('setZmxyCallBackData', { State: 'success' })
    }
  },
  // 开通激活
  // type:
  //  open：开通 active：激活 ytl：一条龙
  sp_credit ({ commit, state }, { udcid, type, opentype = '1', activetype = '1' }) {
    let jsonData = {
      udcid: udcid,
      type: type,
      opentype: opentype,
      activetype: activetype
    }
    if (process.env.NODE_ENV !== 'development') {
      // 生产环境
      if (window.ifNewVersion()) {
        window.WebViewJavascriptBridge.callHandler('credit', jsonData, function (response) {
          commit('setCreditCallBackData', response)
        })
      } else {
        if (Vue.$device['isIphone']) {
          window.WebViewJavascriptBridge.callHandler('credit', jsonData, function (response) {
            commit('setCreditCallBackData', response)
          })
        } else {
          window.MoralAPI.credit(jsonData.udcid, jsonData.type, jsonData.opentype, jsonData.activetype)
        }
      }
    } else {
      // 测试环境
      commit('setCreditCallBackData', { State: 'success' })
    }
  },
  // 支付宝支付
  sp_moralAlipay ({ commit, state }, SignString) {
    let jsonData = {
      SignString: SignString
    }
    if (process.env.NODE_ENV !== 'development') {
      // 生产环境
      if (window.ifNewVersion()) {
        window.WebViewJavascriptBridge.callHandler('credit', jsonData, function (response) {
          commit('setAlipayCallBackData', response)
        })
      } else {
        if (Vue.$device['isIphone']) {
          window.WebViewJavascriptBridge.callHandler('moral_alipay', jsonData, function (response) {
            // commit('setAlipayCallBackData', response)
          })
        } else {
          window.MoralAPI.moral_alipay(jsonData.SignString)
        }
      }
    } else {
      // 测试环境
      commit('setAlipayCallBackData', { State: 'success' })
    }
  },
  // 微信支付
  sp_moralWxpay ({ commit, state }, jsonData) {
    if (process.env.NODE_ENV !== 'development') {
      // 生产环境
      if (window.ifNewVersion()) {
        window.WebViewJavascriptBridge.callHandler('pz_wxpay', jsonData, function (response) {
          commit('setAlipayCallBackData', response)
        })
      } else {
        if (Vue.$device['isIphone']) {
          window.WebViewJavascriptBridge.callHandler('moral_wxpay', jsonData, function (response) {
            // commit('setAlipayCallBackData', response)
          })
        } else {
          window.MoralAPI.moral_wxpay(
            jsonData.appid,
            jsonData.nonce_str,
            jsonData.pck,
            jsonData.partner,
            jsonData.prepayid,
            jsonData.sign,
            jsonData.timeStamp
          )
        }
      }
    } else {
      // 测试环境
      commit('setAlipayCallBackData', { State: 'success' })
    }
  },
  // 刷新
  sp_refresh ({ commit, state }) {
    if (process.env.NODE_ENV !== 'development' && Vue.$utils.UserAgent.getInfo()) {
      // 生产环境
      if (window.ifNewVersion()) {
        // 刷新主页
        window.WebViewJavascriptBridge.callHandler('pz_refresh_homepage', '', function (response) {
          commit('setRefreshCallBackData', { State: 'success' })
        })
      } else {
        if (Vue.$device['isIphone']) {
          window.WebViewJavascriptBridge.callHandler('refresh_home_page', '', function (response) {
            commit('setRefreshCallBackData', { State: 'success' })
          })
        } else {
          window.MoralAPI.Refresh()
          setTimeout(() => {
            commit('setRefreshCallBackData', { State: 'success' })
          }, 2000)
        }
      }
    } else {
      setTimeout(() => {
        commit('setRefreshCallBackData', { State: 'success' })
      }, 1000)
    }
  }
}
// region 安卓老版本回调
// 获取地理位置回调
window.gps_callback = function (response) {
  window.$globalHub.$store.dispatch('getLocationCallback', response)
}
// 银行卡回调
window.moral_bankcard = function (response) {
  window.$globalHub.$store.commit('setBankCard', response)
}
// 上传身份证正反面回调
window.uploadIdCard = function (response) {
  window.$globalHub.$store.commit('setIdCardInfo', { ...state.idCardInfo, ...response })
}
// 人脸识别回调
window.WebViewRefresh = function (response) {
  window.$globalHub.$store.commit('setFaceCallBackData', response)
}
// 调用支付密码回调
window.paykey_callback = function (response) {
  response = toObject(response)
  let obj = {
    State: response.State,
    Msg: { ...response }
  }
  window.$globalHub.$store.commit('setPayCallBackData', obj)
}
// 设置支付密码回调
window.setkey_callback = function (msg) {
  let response = {
    State: 'success',
    Msg: { ...toObject(msg) }
  }
  window.$globalHub.$store.commit('setPayCallBackData', response)
}
// 读取通讯录回调
window.contact_callback = function (response) {
  window.$globalHub.$store.commit('setContactInfo', { readOnly: false, ...response })
}
// 上传通讯录回调
window.contactSuccess = function (response) {
  if (response === 'success') {
    window.MoralAPI.readPhoneNum()
  }
}
// 分享成功回调
window.shareSuccess = function (response) {
  window.$globalHub.$store.commit('setShareCallBackData', { State: 'success' })
}
// 芝麻信用回调
window.zmxy_callback = function (response) {
  window.$globalHub.$store.commit('setZmxyCallBackData', response)
}
// 开通激活组件回调
window.credit_callback = function (response) {
  window.$globalHub.$store.commit('setCreditCallBackData', response)
}
// 支付宝、微信回调
window.paySuccess = function (response) {
  if (response === '支付成功') {
    window.$globalHub.$store.commit('setAlipayCallBackData', { State: 'success' })
  } else {
    window.$globalHub.$store.commit('setAlipayCallBackData', { State: 'fail' })
  }
}

// endregion
function toObject (val) {
  if (typeof val === 'object') {
    return val
  } else {
    return JSON.parse(val)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
