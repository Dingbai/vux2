<template>
  <div class="container">
    <div class="body">
      <img src="../../assets/images/vip/v2home.png" alt="">
        <div class="buttonbox">
          <div class="order order1" :class="{'active':orderType===9,'isPay':[0]}"></div>
          <div class="order order2" :class="{'active':orderType===10,'isPay':[1]}"></div>
          <div class="order order3" :class="{'active':orderType===11,'isPay':[2]}"></div>
        </div>
      <img src="../../assets/images/vip/v3.png" alt="">
    </div>
    <div class="btn" @click="BLL.showlogin"></div>
    <x-dialog v-model="showlogin" :scroll="false" :hide-on-blur="true">
      <group>
        <x-input v-model="phone" :max="11" keyboard="number" type="tel" placeholder="请输入手机号码" :show-clear="true"></x-input>
      </group>
      <group>
        <x-input v-model="verificationCode" :max="6" type="tel" placeholder="请输入验证码">
          <x-button @click.native="BLL.send" plain type="axon" slot="right" class="" :text="countdown.txt" :show-loading="sendbtnloading.state"></x-button>
        </x-input>
      </group>
      <x-button @click="BLL.submit" type="axon">{{loading.str}}</x-button>
    </x-dialog>
  </div>
</template>

<script>
  import { Flexbox, FlexboxItem, Swiper, GroupTitle, SwiperItem, XButton, Divider, XDialog, Group, XInput } from 'vux'
  import BLL from './index'
  import { mapGetters } from 'vuex'

  export default {
    components: {
      Flexbox, FlexboxItem, Swiper, GroupTitle, SwiperItem, XButton, Divider, XDialog, Group, XInput },
    data () {
      return {
        orderType: 9,
        path: 1,
        showlogin: true,
        phone: null,
        verificationCode: null,
        countdown: {
          txt: null,
          state: false,
          timeinterval: null,
          timeoutCount: 0
        },
        isPay: [false, false, false]
      }
    },
    computed: {
      ...mapGetters([
        'usermob', 'userkey', 'udcid'
      ]),
      loading () {
        if (this.$store.getters.btnLoading.str && !this.$store.getters.btnLoading.id) {
          return { state: true, str: this.$store.getters.btnLoading.str }
        } else {
          return { state: false, str: '立即领取' }
        }
      },
      sendbtnloading () {
        if (this.$store.getters.btnLoading.str && this.$store.getters.btnLoading.id === 'sendbtn') {
          return { state: true }
        } else {
          return { state: false }
        }
      }
    },
    created () {
      // 初始化
      this.BLL = new BLL(this)
    },
    beforeDestroy () {},
    mounted () {},
    methods: {}
  }
</script>

<style lang="less" scoped>
  @import "./index";
</style>
