// 微信jssdk初始化
import wx from 'weixin-js-sdk';
let config = require('../../../config/index')
import Vue from 'vue'

export default {
  init (before, success) {
    if (before) {
      before()
    }
    let wx_config = {
      debug: false, // 如果出错，打开调试
      appId: "wxd944a4e7e4fbb863",
      timestamp: 0,
      nonceStr: "",
      signature: "",
      jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'chooseImage', 'uploadImage'] // 需要使用的JS接口列表
    };
    
    // 服务器缓存key，一般按照自己的项目起个特殊的名字，防止重复
    let cacheName = config.build.assetsPublicPath.replace(/\//g, '') + "_wx_config";
    // 当前网页的URL，不包含#及其后面部分
    let request_url = window.location.href.split('#')[0];
    
    // 获取appid对应公众号的accesstoken
    Vue.$api.xHttp.get('/wxApi/wx_new/api/WeixinApi/GetAccessToken?database=iwx_wxd944a4e7e4fbb863', null, {load: false}).then((res) => {
      if (res.accessToken) {
        // 获取签名数据
        Vue.$api.xHttp.post('/wxApi/wx_new/api/WxInitApi/GetSign', {
          cacheName: cacheName,
          accesstoken: res.accessToken,
          url: encodeURI(request_url)
        }, null, {load: false}).then((res) => {
          if (res && res.ret) {
            //设置config
            wx_config.timestamp = res.msg.now;
            wx_config.nonceStr = res.msg.nonceStr;
            wx_config.signature = res.msg.signature;
            wx.config(wx_config);
            if (success) {
              success()
            }
          } else {
            console.log('res:', res)
          }
        }).catch(({code, msg}) => {
          Vue.$vux.alert.show({content: msg})
        })
      } else {
        console.log('res:', res)
      }
    }).catch(({code, msg}) => {
      Vue.$vux.alert.show({content: msg})
    })
  },
  share(params) {
    wx.onMenuShareTimeline(params);
    wx.onMenuShareAppMessage(params)
  },
  chooseImage(success, count = 1) {
    wx.chooseImage({
      count, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        success(res.localIds)
      }
    })
  },
  uploadImage(localId, folder, success, showLoad = true) {
    if (showLoad) {
      Vue.$vux.loading.show('图片上传中')
    }
    wx.uploadImage({
      localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
      isShowProgressTips: 0, // 默认为1，显示进度提示
      success(res) {
        // 上传图片到服务器
        Vue.$api.xHttp.post('/sameOriginApi/imoral_leaper/api/Common/UploadImageWx', {
          mediaid: res.serverId,
          database: "iwx_wxd944a4e7e4fbb863",
          folder: folder
        }, null, {load: false}).then((res) => {
          if (showLoad) {
            Vue.$vux.loading.hide()
          }
          success(res.file_path);
        }).catch(({code, msg}) => {
          if (showLoad) {
            Vue.$vux.loading.hide()
          }
          Vue.$vux.alert.show({content: msg})
        })
      }
    })
  }
}
