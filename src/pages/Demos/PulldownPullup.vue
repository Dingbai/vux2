<template>
  <div class="container">
    <divider>custom pullup pulldown</divider>
    <i-pulldown-pullup :refresh="refresh" :loadMore="loadMore" ref="iPulldownPullupDemo">
      <div class="box2">
        <p v-for="i in demo">占位 {{i}}</p>
      </div>
    </i-pulldown-pullup>
  </div>
</template>

<script>
  import { Divider } from 'vux'
  import iPulldownPullup from '../../components/iPulldownPullup.vue'

  export default {
    components: {
      iPulldownPullup, Divider
    },
    methods: {
      refresh () {
        setTimeout(() => {
          this.demo = 20
          this.$refs.iPulldownPullupDemo.refreshDone(this.demo === 40) // this.demo === 40 => 全部加载完毕条件
        }, 2000)
      },
      loadMore () {
        setTimeout(() => {
          this.demo += 10
          this.$refs.iPulldownPullupDemo.loadMoreDone(this.demo === 40)
        }, 2000)
      }
    },
    data () {
      return {
        demo: 0
      }
    },
    created () {
      this.refresh()
    }
  }
</script>

<style lang="less" scoped>
  .container {
    background-color: #fff;
  }
</style>
