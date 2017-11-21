<template>
  <div class='container'>
    <div class='clearfix'></div>
    <group title='有回调接口' titleColor="#ff6900">
      <group title='支付'>
        <cell title='调用支付控件' @click.native='sp_paykey' is-link></cell>
        <cell title='设置支付密码' @click.native='sp_view_trpassword' is-link></cell>
      </group>
      <div class='clearfix span'></div>
      <group title='银行卡'>
        <x-input title='信用卡号' v-model='bankcard' placeholder='输入的卡号可用获得更高额度(选填)' :required='false' text-align='right' :max='20'>
          <img slot='right' src='../../assets/images/sao.png' style='width: 20px;padding-left: 5px' @click='sp_get_cardnum'>
        </x-input>
      </group>
      <div class='clearfix span'></div>
      <group title='地址'>
        <x-address title='常住地区' v-model='addressValue' :list='addressData' placeholder='请选择地址' raw-value v-if='addressValue.length===3||addressValue.length===0' value-text-align='right'></x-address>
        <x-input title='详细地址' v-model='address' placeholder='请输入详细的街道地址' text-align='right'></x-input>
      </group>
      <div class='clearfix span'></div>
      <group title='通讯录'>
        <x-input title="联系人" v-model="contactInfo.name" placeholder="请通过通讯录选择联系人" :readonly="contactInfo.readOnly" text-align='right'>
          <img slot="right" src="../../assets/images/sao.png" style="width: 20px;padding-left: 5px" @click="sp_choose_contact">
        </x-input>
        <x-input title="手机号码" v-model="contactInfo.phone" placeholder="非紧急情况不会联系" :readonly="true" text-align='right'></x-input>
      </group>
      <div class='clearfix span'></div>
      <group title='身份证'>
        <cell title='正面' @click.native='sp_idcard_recognition(0)' is-link></cell>
        <cell title='背面' @click.native='sp_idcard_recognition(1)' is-link></cell>
        <div style="padding: 10px" v-if="idCardInfo">
          <p>{{idCardInfo}}</p>
          <img :src="idCardInfo.rk1" @click='sp_idcard_recognition(0)' style="width: 150px">
          <img :src="idCardInfo.rk2" @click='sp_idcard_recognition(1)' style="width: 150px">
        </div>
      </group>
      <div class='clearfix span'></div>
      <group title='人脸验证'>
        <cell title='刷脸' @click.native='sp_view' is-link></cell>
      </group>
      <div class="btn-div">
        <x-button plain type="axon" @click.native='submit'>查看填写数据</x-button>
      </div>
    </group>
    <div class='clearfix span'></div>
    <group title='无回调接口' titleColor="#ff6900">
      <cell title='关闭当前页面' @click.native='sp_close_only' is-link></cell>
      <cell title='刷新主页' @click.native='sp_refresh' is-link></cell>
    </group>
    <div class='clearfix span'></div>
    <group title='弹出webview' titleColor="#ff6900">
      <cell title='打开新的webview' @click.native='goView()' is-link></cell>
      <cell title='打开新的webview，关闭当前' @click.native='goView(true)' is-link></cell>
      <cell title='打开新网页，关闭当前' @click.native='goLink' is-link></cell>
    </group>
  </div>
</template>

<script>
import { Group, Cell, XInput, XAddress, ChinaAddressData, Value2nameFilter as value2name, XButton } from 'vux'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import BLL from './Business/Business'

export default {
  components: {
    Group, Cell, XInput, XAddress, XButton
  },
  data () {
    return {
      addressData: ChinaAddressData,
      timeinterval: null,
      addressValue: [],
      address: null
    }
  },
  created () {
    // 初始化
    this.BLL = new BLL(this)
  },
  computed: {
    ...mapGetters([
      'payCallBackData', 'addressCallBackData', 'faceCallBackData'
    ]),
    bankcard: {
      get () {
        return this.$store.state.sp.bankcard
      },
      set (value) {
        this.$store.commit('setBankCard', value)
      }
    },
    contactInfo: {
      get () {
        return this.$store.state.sp.contactInfo
      },
      set (value) {
        this.$store.commit('setContactInfo', {
          name: value.name,
          phone: value.phone
        })
      }
    },
    idCardInfo: {
      get () {
        return this.$store.state.sp.idCardInfo
      },
      set (value) {
        this.$store.commit('idCardInfo', value)
      }
    },
    addressString () {
      return this.addressValue && value2name(this.addressValue, ChinaAddressData)
    }
  },
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        // 获取地理位置
        this.getLocation()
        this.timeinterval = setInterval(this.getLocation, 5000)
      }, 800)
    })
  },
  methods: {
    ...mapMutations([
      'sp_close_only', 'sp_view_trpassword', 'sp_refresh'
    ]),
    ...mapActions([
      'sp_view_trpassword', 'sp_paykey', 'sp_get_cardnum', 'sp_get_location', 'sp_choose_contact', 'sp_idcard_recognition', 'sp_view'
    ]),
    getLocation () {
      // 没有打开定位服务，每5秒重新检测一次
      if (!this.addressCallBackData.openLocation) {
        this.sp_get_location()
      } else {
        clearInterval(this.timeinterval)
      }
    },
    submit () {
      this.$vux.alert.show({
        content: JSON.stringify({
          ...this.$store.state.sp, addressString: this.$store.getters.addressString
        })
      })
    },
    goView (close = false) {
      this.$store.commit('sp_view', {
        controller: 'BagViewController',
        activity: 'LeftHongBaoActivity',
        closeSelf: close
      })
    },
    goLink () {
      this.$store.commit('sp_view', {
        controller: 'WebViewController',
        activity: 'BrowserActivity',
        webLink: `https://poc.51pinzhi.cn/double11`,
        closeSelf: true
      })
    }
  },
  watch: {
    payCallBackData (val) {
      this.$vux.alert.show({ content: JSON.stringify(val) })
    },
    faceCallBackData (val) {
      this.$vux.alert.show({ content: JSON.stringify(val) })
    },
    addressCallBackData (val) {
      if (val.openLocation && val.longtitude && val.lantitude) {
        this.BLL.getLocationInfo(this.addressData, val.longtitude, val.lantitude)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  background-color: #fff;
}
</style>
