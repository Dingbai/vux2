<template>
  <div class="container">
    <div class="body">
      <img src="../../assets/images/vip/v2home.png" alt="">
        <div class="buttonbox">
          <div class="order order1" :class="{'active':orderType===9}"></div>
          <div class="order order2" :class="{'active':orderType===9}"></div>
          <div class="order order3" :class="{'active':orderType===9}"></div>
        </div>
      <img src="../../assets/images/vip/v3.png" alt="">
    </div>
  </div>
</template>

<script>
  import { Flexbox, FlexboxItem, Swiper, GroupTitle, SwiperItem, XButton, Divider } from 'vux'
  import BLL from './index'

  export default {
    components: {
      Flexbox, FlexboxItem, Swiper, GroupTitle, SwiperItem, XButton, Divider
    },
    data () {
      return {
        orderType: 9
      }
    },
    computed: {},
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
