<template>
  <div class="container">
    <div class="header">
      <div class="backarr" @click='goback()'><</div>
      激活信息
    </div>
    <Scroller lock-x scrollbar-y class='scroller' ref="scroll" height='-45'>
      <div class="info yellow">
        手机不怕摔由品值联合平安保险提供，一年内任意渠道新购手机可激活，理赔时以平安保险
        <span @click="showProtocol()" style="text-decoration:underline;">《理赔服务指南》</span>-->
        为准，请确保以下信息正确
      </div>
      <div class="userinput">
        <x-input title="手机号码" v-model="mobile" placeholder="请输入手机号码" keyboard="number" :max="11" type="tel" label-width="2.5rem"></x-input>
        <x-input title="姓名" placeholder="请输入姓名"  label-width="2.5rem" is-type="china-name" v-model="name" :min="2" :max="6"></x-input>
        <x-input title="身份证号" placeholder="请输入身份证号" label-width="2.5rem"  v-model="idcard" :min="2" :max="18"></x-input>
        <x-input title="IMEI" placeholder="请输入手机IMEI码" label-width="2.5rem" is-type="china-name" v-model="imei" :min="2" :max="20">
          <x-button slot="right" type="primary" mini>发送验证码</x-button>
          <Popover v-show="showtip">
            <div class="popover-arrow"></div>
            IMEI编号为15位的数字组合，可以在您手机的包装盒上找到。你也可以在您手机的“关于本机”找到IMEI编号。有两个编号的手机填写任一编号即可。
          </Popover>
        </x-input>
      </div>
      <p>手机品牌</p>
      <group>
        <radio title="手机型号" :options="options" v-model="phonebrand"></radio>
      </group>
      <group>
        <x-input title='购买时间' v-model='time'></x-input>
      </group>
      <x-button plain type="axon" style='width:8rem;margin-top:.2rem;margin-bottom:.2rem'>提交</x-button>
      <p class="infobottom">品值不怕摔服务将于申请次日00:00生效</p>
      <p class="infobottom yellow" style="margin-top:0.3rem;padding-bottom:0.5rem;">
        请正确填写信息，并阅读手机不怕摔服务协议，任何因信息填写错误而导致的保单异常与品值无关
      </p>
    </Scroller>
    <iProtocol v-model="showProto">
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
      <p>test</p>
    </iProtocol>

  </div>
</template>

<script>
  import { XButton, Box, Divider, Scroller, XInput, Popover, Radio, Group } from 'vux'
  import iselect from '../../components/iSelect.vue'
  import iProtocol from '../../components/iScrollDialog.vue'
  export default{
    components: {
      XButton, Box, Divider, iselect, Scroller, XInput, Popover, Radio, Group, iProtocol
    },
    data () {
      return {
        loading: false,
        mobile: null,
        name: null,
        idcard: '',
        imei: '',
        showtip: false,
        options: [{key:0,value:'Apple'},{key:1,value:'其他手机'}],
        phonebrand: 0,
        showProto: false,
        time: '',
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
      },
      showProtocol () {
        this.showProto = !this.showProto
      },
      goback () {

      }
    }
  }
</script>

<style lang="less" scoped>
  @import "./thues.less";
</style>
