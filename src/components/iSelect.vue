<template>
  <div class="container vux-1px-t">
    <cell
      class="picker"
      :title="title"
      :value="currentValue"
      value-align="left"
      is-link
      :border-intent="false"
      :arrow-direction="showContent ? 'up' : 'down'"
      @click.native="showContent = !showContent"></cell>
    <p class="slide" :class="showContent?'animate':''">
      <checker v-model="currentValue" default-item-class="periods_item"
               selected-item-class="periods_item-selected" class="vux-1px-t top">
        <checker-item :value="p" v-for="(p,index) in data" :keys="p" :key="index"
                      @click.native="showContent = !showContent">{{p}}
        </checker-item>
      </checker>
    </p>
  </div>
</template>

<script>
  import { Checker, CheckerItem, Cell } from 'vux'

  export default {
    components: {
      Checker, CheckerItem, Cell
    },
    props: {
      data: Array,
      value: String,
      title: String
    },
    data () {
      return {
        showContent: false,
        currentValue: null,
        tempValue: null
      }
    },
    computed: {},
    created () {
      if (this.value) {
        this.currentValue = this.value
      }
    },
    beforeDestroy () {},
    mounted () {},
    methods: {},
    watch: {
      currentValue (val, old) {
        if (!val && old) {
          val = old
          this.$nextTick(() => {
            this.currentValue = val
          })
        }
        this.$emit('input', val)
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    margin-left: 15PX;
    .picker {
      /deep/ .weui-cell__ft {
        color: #333;
      }
      /deep/ &.weui-cell {
        padding: 10PX 15PX 10PX 0;
      }
    }
    .slide {
      overflow: hidden;
      max-height: 0;
      transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
      .top {
        padding-top: 15px;
      }
      .periods_item {
        border: 1px solid #ff6900;
        color: #ff6900;
        font-size: 26px;
        padding: 12px 20px;
        margin-right: 20px;
        line-height: 28px;
        border-radius: 15px;
        width: 22%;
        text-align: center;
        margin-bottom: 15px;
      }

      .periods_item-selected {
        border: 1px solid #ff6900;
        color: #fff;
        background-color: #ff6900;
      }
    }
    .animate {
      max-height: 9999px;
      transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
      transition-delay: 0s;
    }
  }
</style>
