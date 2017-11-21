<template>
  <div v-transfer-dom>
    <x-dialog v-model="currentValue" :scroll="false" :hide-on-blur="true" @on-hide="onHide">
      <div style="margin: 15px auto;">
        <slot name="scrollTitle"></slot>
        <scroller lock-x :scrollbar-y="true" :height="scrollHeight+'px'" :prevent-default="false" ref="iDialogScrollerDemo">
          <!--content slot-->
          <slot></slot>
        </scroller>
      </div>
      <span class="vux-close" @click="currentValue=false"></span>
    </x-dialog>
  </div>
</template>

<script>
import { XDialog, Scroller, TransferDomDirective as TransferDom } from 'vux'

export default {
  directives: {
    TransferDom
  },
  components: {
    XDialog, Scroller
  },
  props: {
    bottomHeight: {
      type: Number,
      default: 150
    },
    value: {
      type: Boolean,
      default: false
    },
    onHide: {
      type: Function,
      default: () => { }
    }
  },
  computed: {
    scrollHeight: function () {
      return this.$utils.Common.getWidthHeight().height - this.bottomHeight
    }
  },
  data () {
    return {
      currentValue: false
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
      if (val) {
        this.$nextTick(() => {
          this.$refs.iDialogScrollerDemo.reset({ top: 0 })
        })
      }
    },
    currentValue (val) {
      this.$emit('input', val)
    }
  }
}
</script>
