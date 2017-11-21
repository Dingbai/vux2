<template>
  <div class="container">
    <div v-for="attribute in attributes">
      <checker
        v-model="attribute.value"
        default-item-class="checker"
        selected-item-class="checker-selected"
        disabled-item-class="checker-disabled"
      >
        <div>{{attribute.name}}</div>
        <checker-item :disabled="item.unselectable" :value="item.name" v-for="item in attribute.childAttr"
                      :key="item.id" @on-item-click="clickHandler(item)">{{item.name}}
        </checker-item>
        <br><br>
      </checker>
    </div>
    <p><span>价格：</span><span>{{price}}</span></p>
    <p><span>库存：</span><span>{{count}}</span></p>
    <p><span>当前选择的skuid：</span><span>{{skuid}}</span></p>
  </div>
</template>

<script>
  import { Checker, CheckerItem } from 'vux'
  import BLL from './Index'

  export default {
    components: {
      Checker, CheckerItem
    },
    data () {
      return {
        attributes: [],
        price: '',  // 总价格
        count: 0, // 总数量
        skuid: null // 选择的skuid
      }
    },
    computed: {},
    created () {
      // 初始化
      this.BLL = new BLL(this)
      this.BLL.init()
    },
    beforeDestroy () {},
    mounted () {
      this.$nextTick(() => {
        this.BLL.skuHandler()
      })
    },
    methods: {
      clickHandler (item) {
        if (!item.unselectable) {
          this.BLL.clickHandler(item)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .checker {
    background-color: #ddd;
    color: #222;
    font-size: 14PX;
    padding: 5PX 10PX;
    margin-right: 10PX;
    line-height: 18PX;
    border-radius: 15px;
  }

  .checker-selected {
    background-color: #FF3B3B;
    color: #fff;
  }

  .checker-disabled {
    color: #999;
  }
</style>
