<template>
  <div class="i-hide-input-contain">
    <div v-if="showTopLine"></div>
    <cell @click.native="idCardClick" v-show="!showInput" :class="`txt_${titleAlign}`" :title="title" :value="hideValue"
          :valueAlign="textAlign">
    </cell>
    <x-input :title=title :placeholder=placeholder v-model="currentValue" :max="length" :keyboard="keyboard"
             :text-align="textAlign" :class="[inputClass,showTopLine?'showTopLine':'']" v-show="showInput"
             ref="idCardInput"
             @on-blur="onBlur"></x-input>
  </div>
</template>

<script>
  import { XInput, Cell } from 'vux'

  export default {
    props: {
      value: String,
      type: String,
      title: String,
      placeholder: String,
      showTopLine: {
        type: Boolean,
        default: true
      },
      textAlign: {
        type: String,
        default: 'left'
      },
      titleAlign: {
        type: String,
        default: 'left'
      }
    },
    components: {
      XInput,
      Cell
    },
    data () {
      return {
        currentValue: '',
        showInput: true,
        length: 0,
        regular: null,
        autoHide: true,
        keyboard: null
      }
    },
    computed: {
      hideValue () {
        if (this.currentValue && ((!this.autoHide || this.currentValue.length === this.length) || this.autoHide)) {
          return this.currentValue.replace(this.regular[0], this.regular[1])
        }
        return ''
      },
      txtClass () {
        return this.titleAlign
      },
      inputClass () {
        return `title_${this.titleAlign} txt_${this.textAlign}`
      }
    },
    created () {
      switch (this.type) {
        case 'idCard' : {
          this.length = 18
          this.regular = [/(\d{2})\d{14}(\w{2})/, '$1••••••••••••••$2']
          break
        }
        case 'name' : {
          this.length = 6
          this.regular = [/.(?=.)/g, '•']
          this.autoHide = false
          break
        }
        case 'phone' : {
          this.length = 11
          this.regular = [/(\d{3})\d{4}(\d{4})/, '$1••••$2']
          this.keyboard = 'number'
          break
        }
      }
      if (this.value) {
        this.currentValue = this.value
        this.showInput = false
      }
    },
    beforeDestroy () {},
    mounted () {},
    beforeRouteEnter (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
      })
    },
    beforeRouteLeave (to, from, next) {
      // 导航离开该组件的对应路由时调用
      // 可以访问组件实例 `this`
      next()
    },
    methods: {
      onBlur () {
        setTimeout(() => {
          if (this.currentValue) {
            this.showInput = false
          }
        }, 0)
      },
      idCardClick () {
        this.showInput = true
        this.$nextTick(() => {
          this.$refs.idCardInput.focus()
        })
      }
    },
    watch: {
      value (val) {
        this.currentValue = val
      },
      currentValue (val) {
        if (this.autoHide && val && val.length === this.length) {
          this.showInput = false
          this.$nextTick(() => {
            this.$refs.idCardInput.blur()
          })
        }
        this.$emit('input', val)
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less">
  .i-hide-input-contain {
    .weui-cell__ft {
      color: #333;
    }
    .weui-label {
      width: 4.2em !important;
      margin-right: 1em;
    }
    .title_right {
      .weui-label {
        text-align: right;
      }
    }
    .title_left {
      .weui-label {
        text-align: left;
      }
    }
    .txt_left {
      .vux-cell-bd {
        p {
          text-align: left;
        }
      }
    }
    .txt_right {
      .vux-cell-bd {
        p {
          text-align: right;
        }
      }
    }
  }
</style>
