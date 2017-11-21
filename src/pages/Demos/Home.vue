<template>
  <div class="index-contain" :style="{height: `${height}px`}">
    <div class="vux-demo">
      <img class="logo" src="../../assets/images/vux_logo.png">
      <h2>vux2项目模版</h2>
    </div>
    <group title="控件">
      <cell title="按钮" :link="{path:'/demo/button'}"></cell>
      <cell title="弹窗" :link="{path:'/dialog'}"></cell>
      <cell title="上拉加载下拉刷新" :link="{path:'/load'}"></cell>
      <cell title="无限加载" :link="{path:'/infiniteLoading'}"></cell>
      <cell title="常用输入组件" :link="{path:'/input'}"></cell>
    </group>
    <group title="接口">
      <cell title="调用接口" :link="{path:'/http'}"></cell>
      <cell title="调用App接口" :link="{path:'/sp'}"></cell>
    </group>
    <group title="Utils">
      <cell title="常用辅助方法" :link="{path:'/utils'}"></cell>
      <cell title="Sku Demo" :link="{path:'/sku'}"></cell>
    </group>
    <group title="微信">
      <cell title="测试微信jssdk" :link="{path:'/wx'}"></cell>
    </group>
    <group title="布局">
      <cell title="测试flexible适配" :link="{path:'/flexible'}"></cell>
    </group>
    <group title="404">
      <cell title="测试404页面" :link="{path:'/XXX'}"></cell>
    </group>
  </div>
</template>
<script>
  import { Cell, Group } from 'vux'

  export default {
    components: {
      Cell, Group
    },
    data () {
      return {
        height: window.innerHeight
      }
    },
    created () {
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .index-contain {
    background-color: #fff;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
    .vux-demo {
      text-align: center;
    }
    .logo {
      width: 25%;
    }
  }
</style>
