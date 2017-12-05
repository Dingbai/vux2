<template>
  <div class="container">
    <flexbox :gutter="0">
      <button @click="changeIndex">get</button>
    </flexbox>
    <div class="detail">
      {{detail}}
      <!--<img src="detail.image" alt="">-->
    </div>
    <button @click="loading">toast</button>
    <button @click="BLL.nextPage()">弹框</button>
    <button @click="BLL.showloading()">显示加载框</button>
    <br>
    <button @click="BLL.testClass()">引入class</button>
    <button @click="BLL.mutilApi()">接口</button>
    <group>
      <x-button @click.native="btnstr('btn1')" type="axon" :show-loading="btnloading.state" :text="btnloading.str"></x-button>

      <x-button @click.native="btnstr('btn2')" type="axon" :show-loading="btnloading2.state" :text="btnloading2.str"></x-button>
    </group>
  </div>
</template>

<script>
  import { Flexbox, FlexboxItem, Group, Cell, XButton } from 'vux'
  import BLL from './demoget'

  export default {
    components: {
      Flexbox, FlexboxItem, Group, Cell, XButton
    },
    data () {
      return {
        detail: null,
        index: 1220562,
        info: {
          longtitude: 118.7569226148501,
          lantitude: 31.97793035793655
        }
      }
    },
    computed: {
      btnloading () {
        if (this.$store.getters.btnLoading.str && this.$store.getters.btnLoading.id === 'btn1') {
          return {state: true, str: this.$store.getters.btnLoading.str}
        }
        return {state: false, str: '下一步'}
      },
      btnloading2 () {
        if (this.$store.getters.btnLoading.str && this.$store.getters.btnLoading.id === 'btn2') {
          return {state: true, str: this.$store.getters.btnLoading.str + 'testloadingbutton'}
        }
        return {state: false, str: '下一步'}
      }
    },
    created () {
      // 初始化
      this.BLL = new BLL(this)
//      this.BLL.init()
    },
    beforeDestroy () {},
    mounted () {},
    methods: {
      changeIndex () {
        this.index ++
      },
      loading () {
        this.$vux.toast.show({ text: '正在加载' })
      },
      btnstr (id) {
        this.BLL.mutilApi(id)
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "./demoget";
</style>
