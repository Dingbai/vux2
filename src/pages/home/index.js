import api from '../../api/index'
import Base from '../Base/index'

const countdownDefaultData = {
  timeoutCount: 60,
  txt: '获取验证码'
}
export default class extends Base {
  constructor (vm) {
    super(vm)
    this.vm.countdown = { ...countdownDefaultData }
    // 先获取用户订单状态
    if (this.appInfo()) {
      api.QueryMyOrders({
        successHanding: res => {
          this.vm.$vux.alert.show({content: res.Data})
          console.log(res.Data)
        }
      })
    }
    // api.QueryMyOrders({
    //   successHanding: res => {
    //     this.vm.$vux.toast.show(res.Data)
    //   }
    // })
  }
  showlogin () {
  }
  send () {
    // 发送验证码
    if (this.disabledPhone()) {
      this.vm.$vux.toast.show(this.disabledPhone())
      return
    }
    if (!this.vm.$utils.Validate.chkFormat(this.vm.phone, 'phone')) {
      this.vm.$vux.toast.show('请输入正确的11位手机号')
      return
    }
    this.vm.countdown.txt = '发送中'
    // this.vm.countdown.timeinterval = setInterval(() => {
    //   this.countDown()
    // }, 1000)
    api.sendcode(
      { Mobile: this.vm.phone },
      {
        successHanding: res => {
          this.vm.$vux.toast.show(res.Message)
          this.countDown()
          this.vm.countdown.timeinterval = setInterval(() => {
            this.countDown()
          }, 1000)
        },
        load: 'btn',
        loadID: 'sendbtn'
      }
    )
  }
  submit () {
    // 手机号码正确并且验证码正确
    if (this.disabled() || this.errMsg()) {
      this.vm.$vux.toast.show(this.disabled() || this.errMsg())
      return
    }
    // 请求配置
    const op = {
      type: 2,
      completeHanding: () => {
        this.vm.$store.commit('UPDATA_BTNLOADINGSTR', null)
      },
      failHandling: (res) => {
        this.vm.$vux.toast.show(res.Msg)
      },
      exceptionHandling: () => {
        this.vm.$vux.toast.show('传输异常，请稍后再试')
      }
    }
    const op2 = {
      ...op,
      completeHanding: () => {
        this.vm.$store.commit('UPDATE_BTNLOADINGSTR', null)
        this.vm.showlogin = false
      }
    }
    this.vm.$store.commmit('UPDATE_BTNLOADINGSTR', { str: '领取中', id: null })
    api.login(
      {
        // 登录请求所需参数 Mobile loginCode
        Mobile: this.vm.phone,
        loginCode: this.vm.verificationCode
      },
      {
        successHanding: res => {
          console.log('sendtest')
          this.vm.$store.commit('SET_AUTH', res.Data)
          api.phoneAccess(null, {
            // 验证用户信息
            successHanding: res => {
              this.vm.$store.commit('UPDATE_BTNLOADINGSTR', null)
              this.vm.showlogin = false
              if (res.Data.NeedToGetCredit) {
                this.goCredit()
              } else {
                this.goNext(res.Data)
              }
            },
            ...op2
          })
        },
        ...op
      }
    )
  }
  goNext (data) {
    const _this = this
    // 不是vip
    if (!data.VipLevel) {
      // 在app里面
      if (this.appInfo()) {
        this.vm.$vux.alert.show({
          content: '您还不是品值VIP，现在成为VIP付299限时返300，还不快来。',
          onHide () {
            _this.vm.$router.push('/vip')
          }
        })
      } else {
        // 不在app内
        // 方式一： 提醒用户下载
        if (this.vm.path === 1) {
          this.vm.$vux.alert.show({
            content: '您还不是品值VIP，请先登录品值APP获得VIP权限。',
            onHide () {
              _this.goApp()
            }
          })
        } else {
          // 方式二： 直接进入vip页面
          this.vm.$vux.alert.show({
            content: '您还不是品值VIP，请先登录品值APP获得VIP权限。',
            onHide () {
              _this.$router.push('/vip')
            }
          })
        }
      }
    } else if (data.vipLevel === 2) {
      if (this.appInfo()) {
        // app内直接进入下单页
        this.vm.$router.push(`/order_${this.vm.orderType}`)
      } else {
        if (data.UserLimit >= 1) {
          // 有额度的话直接进入下单页
          this.vm.$router.push(`/order_${this.vm.orderType}`)
        } else {
          this.vm.$vux.alert.show({
            content: '很抱歉，您的额度不足。请登录品值APP激活额度。',
            onHide () {
              _this.goApp()
            }
          })
        }
      }
    } else if (data.vipLevel === 1) {
      this.vm.$vux.alert.show({
        content: '您已在上一期活动中获得该福利，无法重复购买。',
        onHide () {
          _this.goApp()
        }
      })
    }
  }
  // 验证手机号和验证码是否正确输入
  disabled () {
    if (!this.vm.phone) {
      return '请输入手机号'
    } else if (this.vm.phone.length !== 11) {
      return '请完整输入11位手机号'
    } else if (!this.vm.verificationCode) {
      return '请输入验证码'
    } else if (this.vm.verificationCode.length !== 6) {
      return '请完整输入6位验证码'
    }
    return null
  }
  disabledPhone () {
    // 验证码发送按钮
    if (this.vm.countdown.txt !== countdownDefaultData.txt) {
      return '验证码已发送，请耐心等待'
    } else if (!this.vm.phone) {
      return '请输入手机号'
    } else if (this.vm.phone.length !== 11) {
      return '请完整输入11位手机号'
    }
    return null
  }
  errMsg () {
    if (!this.vm.$utils.Validate.chkFormat(this.vm.phone, 'phone')) {
      return '请输入正确的手机号'
    }
    if (!this.vm.$utils.Validate.chkFormat(this.vm.verificationCode, 'code')) {
      return '请输入正确的验证码'
    }
    return null
  }
  countDown () {
    // 验证码倒计时
    if (this.vm.countdown.timeoutCount > 0) {
      this.vm.countdown.txt = this.vm.countdown.timeoutCount-- + 's后获取'
    } else {
      clearInterval(this.vm.countdown.timeinterval)
      this.vm.countdown = { ...countdownDefaultData }
    }
  }
}
