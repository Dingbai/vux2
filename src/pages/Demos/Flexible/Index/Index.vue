<template>
  <div>
    <div class="container">
      <div class="head">
        <div>可用额度</div>
        <div class="title-score">30000.00<span>元</span></div>
        <div>总额度：30000.00元</div>
      </div>
      <group class="close-cell" v-show="showCell">
        <cell title="品值花 服务费全免，限时5天" is-link @click.native="BLL.link(1)">
          <span class="vux-close" @click.stop="showCell=false" slot="icon"></span>
        </cell>
      </group>
      <group class="item-cell">
        <cell :title="`可用额度1000.00元`" :inline-desc="`话费额度：1000.00元`" is-link @click.native="BLL.link(2)">
          <img slot="icon" class="icon" src="../images/3.png">
          <div slot="value">
            <span style="color: #FF6900">去充值</span>
          </div>
        </cell>
        <cell :title="`可用额度20000.00元`" :inline-desc="`消费额度：20000.00元`" is-link @click.native="BLL.link(3)">
          <img slot="icon" class="icon" src="../images/2.png">
          <div slot="value">
            <span style="color: #FF6900">去消费</span>
          </div>
        </cell>
        <cell :title="`可用额度30000.00元`" :inline-desc="`提现额度：30000.00元`" is-link @click.native="BLL.link(4)">
          <img slot="icon" class="icon" src="../images/1.png">
          <div slot="value">
            <span style="color: #FF6900">去提现</span>
          </div>
        </cell>
      </group>
      <div class="tips">
        专项额度
      </div>
      <div>
        <flexbox class="txt2">
          <flexbox-item :span="2/3">
            <img src="../images/5.png" style="width: 20px;padding: 0 7px 0 15px">南京银行 30W安家备用金
          </flexbox-item>
          <flexbox-item>
            <x-button type="axon" plain @click.native="BLL.link(5)" class="go-btn">立即开通</x-button>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
  </div>
</template>
<script>
  import { Cell, Group, XButton, Flexbox, FlexboxItem } from 'vux'
  import BLL from './Index'

  export default {
    components: {
      Cell, Group, XButton, Flexbox, FlexboxItem
    },
    data () {
      return {
        type: 0,
        purchaseLines: null,
        rechargeLines: null,
        cashLines: null,
        totalCredit: 0,
        totalAvaBalance: 0,
        showCell: true
      }
    },
    created () {
      // 首页清除缓存
      this.$utils.LocalStorage.clear()
      // 生成guid
      this.$store.commit('CREATED_GUID')
      // 初始化
      this.BLL = new BLL(this)
      this.BLL.init()
    },
    methods: {}
  }
</script>

<style lang="less" scoped>
  @import "./Index";
</style>
