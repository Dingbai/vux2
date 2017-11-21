<template>
  <div class="container">
    <p v-for="item in list">
      Line:
      <span v-text="item"></span>
    </p>
    <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading">
      <span slot="no-results">
        已经全部加载完毕
      </span>
      <span slot="no-more">
        已经全部加载完毕
      </span>
    </infinite-loading>
  </div>
</template>

<script>
  import InfiniteLoading from 'vue-infinite-loading'

  export default{
    components: {
      InfiniteLoading
    },
    data () {
      return {
        list: []
      }
    },
    computed: {},
    created () {},
    beforeDestroy () {},
    mounted () {},
    methods: {
      onInfinite () {
        setTimeout(() => {
          const temp = []
          for (let i = this.list.length + 1; i <= this.list.length + 30; i++) {
            temp.push(i)
          }
          this.list = this.list.concat(temp)
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
          if (this.list.length >= 80) {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
          }
        }, 1000)
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    /*background-color: #fff;*/
  }
</style>
