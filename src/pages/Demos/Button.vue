<template>
  <div class="container">
    <div class="box">
      <x-button type="axon" @click.native="test">实心按钮</x-button>
      <x-button plain type="axon">空心按钮</x-button>
      <x-button type="axon" disabled>实心按钮（不可点击）</x-button>
      <x-button plain type="axon" disabled>空心按钮（不可点击）</x-button>
      <divider>Loading Button</divider>
      <x-button type="axon" :show-loading="loading" @click.native="next">{{btnTxt}}</x-button>
      <x-button type="axon" plain :show-loading="loading" @click.native="next">{{btnTxt}}</x-button>
    </div>
  </div>
</template>

<script>
  import { XButton, Box, Divider } from 'vux'

  export default{
    components: {
      XButton, Box, Divider
    },
    data () {
      return {
        loading: false
      }
    },
    computed: {
      btnTxt () {
        return this.loading ? '加载中...' : '下一步'
      }
    },
    methods: {
      test () {
        this.$router.push('/home')
      },
      next () {
        if (!this.loading) {
          this.loading = true
          setTimeout(() => {
            this.loading = false
          }, 2000)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    background-color: #fff;
    min-height: 100%;
    .box {
      padding: 15px;
    }
  }
</style>
