<template>
  <div class="container">
    <div class="weui-uploader" style="padding:15px;">
      <div class="weui-uploader__bd">
        <ul class="weui-uploader__files" v-show="imageUrlUpload">
          <li class="weui-uploader__file" :style="backgroundDiv"></li>
        </ul>
        <div class="weui-uploader__input-box" v-show="!imageUrlUpload">
          <div class="weui-uploader__input" @click="chooseImage">
          </div>
        </div>
      </div>
      <p class="weui-uploader__title" style="word-break: break-all">图片地址：{{imageUrlUpload}}</p>
      <box gap="10px 0">
        <x-button type="axon" mini @click.native="uploadImage()">上传到服务器</x-button>
      </box>
      <div class="weui-uploader__bd">
        <ul class="weui-uploader__files" v-show="imageUrlServer">
          <li class="weui-uploader__file" :style="backgroundDiv2"></li>
        </ul>
      </div>
      <div class="weui-uploader__title" style="word-break: break-all">服务器地址：{{imageUrlServer}}</div>
    </div>
  </div>
</template>

<script>
  import { XButton, Box } from 'vux'

  export default{
    components: {
      XButton, Box
    },
    data () {
      return {
        imageUrlUpload: '',
        imageUrlServer: ''
      }
    },
    computed: {
      backgroundDiv () {
        return {
          backgroundImage: 'url(' + this.imageUrlUpload + ')'
        }
      },
      backgroundDiv2 () {
        return {
          backgroundImage: 'url(' + this.imageUrlServer + ')'
        }
      }
    },
    created () {
      if (this.$device.isWechat) {
        // 初始化分享功能
        this.wxShare()
      } else {
        this.$vux.toast.show('请在微信浏览器中打开')
      }
    },
    methods: {
      wxShare () {
        this.$utils.WeiXin.share({
          title: '分享标题', // 分享标题
          desc: '分享描述', // 分享描述
          link: 'http://dxb.51pinzhi.cn/vux_demo/', // 分享链接
          imgUrl: 'http://placehold.it/100x100', // 分享图标
          success () {
            this.$vux.toast.show('分享成功回调')
          },
          cancel () {
            this.$vux.toast.show('取消分享回调')
          }
        })
        this.$vux.toast.show('请测试分享功能')
      },
      chooseImage () {
        this.$utils.WeiXin.chooseImage((localIds) => {
          this.imageUrlUpload = localIds[0]
        })
      },
      uploadImage () {
        if (this.imageUrlUpload) {
          this.$utils.WeiXin.uploadImage(this.imageUrlUpload, 'wx_test', (path) => {
            this.imageUrlServer = path
          })
        } else {
          this.$vux.toast.show('请先选择图片')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    background-color: #fff;
    @import '~vux/src/styles/weui/widget/weui-uploader/index.less';
  }
</style>
