<template>
  <div class="container">
    <div class="clearfix"></div>
    <group label-width="4.4em" label-margin-right=".8em" label-align="right" title="中间对齐">
      <x-input title="姓名" placeholder="请输入姓名" is-type="china-name" v-model="name" :min="2" :max="6"></x-input>
      <x-input title="手机号码" v-model="mobile" placeholder="请输入手机号码" keyboard="number" :max="11" type="tel"></x-input>
      <x-address title="常住地区" v-model="addressValue" :list="addressData" placeholder="请选择地址" raw-value value-text-align="left"></x-address>
      <popup-picker title="最高学历" :data="educationData" v-model="highestEducation" value-text-align="left"></popup-picker>
      <iSelect title="最高学历" :data="educationData2" v-model="highestEducation2"></iSelect>
    </group>
    <div class="clearfix span"></div>
    <group title="两边对齐">
      <x-input title="姓名" placeholder="请输入姓名" is-type="china-name" v-model="name" :min="2" :max="6" text-align="right"></x-input>
      <x-input title="手机号码" v-model="mobile" placeholder="请输入手机号码" keyboard="number" :max="11" type="tel" text-align="right"></x-input>
      <x-address title="常住地区" v-model="addressValue" :list="addressData" placeholder="请选择地址" raw-value></x-address>
      <popup-picker title="最高学历" :data="educationData" v-model="highestEducation" placeholder="请选择最高学历"></popup-picker>
    </group>
    <div class="clearfix span"></div>
    <group label-width="4.4em" label-margin-right=".8em" title="自动隐藏控件(中间对齐)">
      <hide-input v-model="hideName" title="姓名" placeholder="请输入姓名" type="name" :showTopLine="false" title-align="center"></hide-input>
      <hide-input v-model="hidePhone" title="手机号码" placeholder="请输入手机号码" type="phone" title-align="right"></hide-input>
      <hide-input v-model="idCardNumber" title="身份证号" placeholder="请输入身份证号" type="idCard" title-align="right"></hide-input>
    </group>
    <group label-width="4.4em" label-margin-right=".8em" title="自动隐藏控件(靠左对齐)">
      <hide-input v-model="hideName" title="姓名" placeholder="请输入姓名" type="name" :showTopLine="false"></hide-input>
      <hide-input v-model="hidePhone" title="手机号码" placeholder="请输入手机号码" type="phone"></hide-input>
      <hide-input v-model="idCardNumber" title="身份证号" placeholder="请输入身份证号" type="idCard"></hide-input>
    </group>
    <div class="clearfix span"></div>
    <group title="自动隐藏控件(两边对齐)">
      <hide-input v-model="hideName" title="姓名" placeholder="请输入姓名" type="name" :showTopLine="false" text-align="right"></hide-input>
      <hide-input v-model="hidePhone" title="手机号码" placeholder="请输入手机号码" type="phone" text-align="right"></hide-input>
      <hide-input v-model="idCardNumber" title="身份证号" placeholder="请输入身份证号" type="idCard" text-align="right"></hide-input>
    </group>
    <div class="clearfix span"></div>
    <group title="自动添加空格">
      <!-- mask:其中 9 表示数字，A 表示大写字母，S 表示数字或者字母 -->
      <x-input title="储蓄卡" v-model="bankCardInput" placeholder="输入的卡号可用于提现" :max="23" keyboard="number" type="tel" mask="9999 9999 9999 9999 999">
      </x-input>
      <x-input title="手机号" v-model="phoneInput" placeholder="请输入手机号码" :max="13" keyboard="number" type="tel" mask="999 9999 9999">
      </x-input>
    </group>
    <div class="btn-div">
      <x-button type="axon" plain @click.native="next" :disabled="disabled">下一步</x-button>
    </div>
  </div>
</template>

<script>
import {
  XInput, Group, XButton, Cell, XAddress, ChinaAddressData, Value2nameFilter as value2name, PopupPicker
} from 'vux'
import hideInput from '../../components/iHideInput.vue'
import iSelect from '../../components/iSelect.vue'

export default {
  components: {
    XInput,
    XButton,
    Group,
    Cell,
    hideInput,
    XAddress,
    PopupPicker,
    iSelect
  },
  data () {
    return {
      name: null,
      mobile: null,
      idCardNumber: '',
      showInput: false,
      addressValue: [],
      addressData: ChinaAddressData,
      educationData: [['硕士及以上', '本科', '大专', '中专/高中', '初中及以下']],
      highestEducation: [],
      educationData2: ['硕士及以上', '本科', '大专', '中专/高中', '初中及以下'],
      highestEducation2: null,
      hideName: null,
      hidePhone: null,
      bankCardInput: '',
      phoneInput: ''
    }
  },
  created () {
  },
  computed: {
    bankCard () {
      return this.bankCardInput.replace(/\s/g, '')
    },
    phone2 () {
      return this.phoneInput.replace(/\s/g, '')
    },
    errMsg () {
      if (!this.$utils.Validate.chkFormat(this.name, 'chinaName')) {
        return '请输入正确的姓名'
      }
      if (!this.$utils.Validate.chkFormat(this.mobile, 'phone')) {
        return '请输入正确的手机号'
      }
      if (!this.$utils.Validate.chkFormat(this.idCardNumber, 'idcard')) {
        return '请输入正确的身份证号'
      }
      return null
    },
    disabled () {
      if (!this.name || this.name.length < 2) {
        return true
      } else if (!this.mobile || this.mobile.length !== 11) {
        return true
      } else if (!this.idCardNumber || this.idCardNumber.length !== 18) {
        return true
      } else if (this.addressValue.length !== 3) {
        return true
      } else if (this.highestEducation.length !== 1) {
        return true
      }
      return false
    },
    addressString () {
      return this.addressValue && value2name(this.addressValue, ChinaAddressData)
    }
  },
  methods: {
    next () {
      if (this.errMsg) {
        this.$vux.toast.show(this.errMsg)
        return
      }
      this.$vux.toast.show('OK')
    }
  },
  watch: {
  }
}
</script>

<style lang="less" scoped>
.container {
  background-color: #fff;
  /*margin-bottom: 20px;*/
  .btn-div {
    padding: 35px 15px 0;
    background-color: #eee;
  }
}
</style>
