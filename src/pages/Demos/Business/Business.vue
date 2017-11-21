<template>
  <div class="container">
    <div class="clearfix"></div>
    <group title="接口">
      <cell title="调用单个接口" @click.native="test1" is-link></cell>
      <cell title="设置成功条件" @click.native="test3" is-link></cell>
      <cell title="接口异常" @click.native="test4" is-link></cell>
      <cell title="并发调用多个接口" @click.native="test5" is-link></cell>
      <cell title="连续调用多个接口" @click.native="test6" is-link></cell>
    </group>
    <group title="按钮加载状态">
      <div class="btn-div">
        <x-button type="axon" plain @click.native="test2(null)" :show-loading="btnLoading.state"
                  :text="btnLoading.str">
        </x-button>
        <x-button type="axon" plain @click.native="test2('test2')" :show-loading="btnLoading2.state"
                  :text="btnLoading2.str">
        </x-button>
      </div>
    </group>
  </div>
</template>

<script>
  import { Group, Cell, XButton } from 'vux'
  import BLL from './Business'
  export default{
    components: {
      Group, Cell, XButton
    },
    data () {
      return {}
    },
    created () {
      // 初始化
      this.BLL = new BLL(this)
    },
    computed: {
      btnLoading () {
        if (this.$store.getters.btnLoading.str && !this.$store.getters.btnLoading.id) {
          return {state: true, str: this.$store.getters.btnLoading.str}
        }
        return {state: false, str: '下一步'}
      },
      btnLoading2 () {
        if (this.$store.getters.btnLoading.str && this.$store.getters.btnLoading.id === 'test2') {
          return {state: true, str: this.$store.getters.btnLoading.str + '222'}
        }
        return {state: false, str: '下一步'}
      }
    },
    methods: {
      test1 () {
        this.BLL.http({longtitude: 118.7569226148501, lantitude: 31.97793035793655})
      },
      test2 (id) {
        this.BLL.http({longtitude: 118.7569226148501, lantitude: 31.97793035793655}, {
          load: 'btn',
          loadMsg: '计算中',
          loadID: id,
          successHanding: ({Msg}) => {
            this.$vux.toast.show({text: Msg.result.business})
          }
        })
      },
      test3 () {
        this.BLL.http({longtitude: 118.7569226148501, lantitude: 31.97793035793655}, {
          validator: (res) => res.State !== 'success',
          failHandling: () => alert('出错啦')
        })
      },
      test4 () {
        this.BLL.ex({longtitude: 118.7569226148501, lantitude: 31.97793035793655})
      },
      test5 () {
        this.BLL.all()
      },
      test6 () {
        this.BLL.sequential({
          longtitude: 118.7569226148501, lantitude: 31.97793035793655, udcid: 'VfpYC3A/933yuzKgHhCB4g=='
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    background-color: #fff;
  }
</style>
