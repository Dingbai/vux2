<template>
  <div>
    <popup v-model="show" @on-hide="hide">
      <div class="shareDiv">
        <flexbox :gutter="0" wrap="wrap" class="shareContext">
          <flexbox-item :span="1/4" class="shareImage t1" @click.native="share(15,'WEIXIN')">
            微信好友
          </flexbox-item>
          <flexbox-item :span="1/4" class="shareImage t2" @click.native="share(16,'WEIXIN_CIRCLE')">
            微信朋友圈
          </flexbox-item>
          <flexbox-item :span="1/4" class="shareImage t3" @click.native="share(20,'QQ')">
            QQ
          </flexbox-item>
          <flexbox-item :span="1/4" class="shareImage t4" @click.native="share(19,'SMS')">
            短信
          </flexbox-item>
        </flexbox>
        <div class="clearBtn" @click="hide">取消</div>
      </div>
    </popup>
  </div>
</template>
<style lang="less" rel="stylesheet/less">
  .shareDiv {
    background-color: #fff;
    text-align: center;
    .shareTitleDiv {
      padding: 10px 0;
      .shareTitle {
        text-align: center;
      }
    }
    .clearBtn {
      padding: 10px;
      border-top: 1px solid #d2d2d2;
      margin: 0 20px;
    }
    .shareContext {
      text-align: center;
      padding: 5px 0;
      .shareImage {
        height: 30px;
        padding-top: 70px;
        font-size: 13px;
        background: no-repeat center 15px;
        background-size: 50%;
      }
      .shareImage.t1 {
        background-image: url('../assets/images/share/t1.png');
      }

      .shareImage.t2 {
        background-image: url('../assets/images/share/t2.png');
      }

      .shareImage.t3 {
        background-image: url('../assets/images/share/t3.png');
      }

      .shareImage.t4 {
        background-image: url('../assets/images/share/t4.png');
      }
    }
  }
</style>
<script>
  import { Flexbox, FlexboxItem, Popup } from 'vux'
  export default{
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      share_info: Object
    },
    components: {
      Flexbox,
      FlexboxItem,
      Popup
    },
    data () {
      return {
        show: false
      }
    },
    methods: {
      share: function (type, name) {
        this.$store.dispatch('sp_share_simple',
          {
            title: this.share_info.title,
            desc: this.share_info.desc,
            icon: type === 19 ? '' : this.share_info.icon,
            link: type === 20 ? this.share_info.linkQQ : this.share_info.link,
            snsType: type,
            snsName: name
          })
      },
      hide () {
        this.$emit('update:visible', false)
        this.show = false
      }
    },
    watch: {
      visible (val) {
        this.$emit('update:visible', val)
        this.show = val
      }
    }
  }
</script>
