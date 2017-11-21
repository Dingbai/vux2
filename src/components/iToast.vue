<template>
  <div v-show='show' class='i-toast-contain'>
    <div class='weui_mask_transparent'></div>
    <div class='center-container is-table'>
      <div class='table-cell'>
        <div class='center-block' id='iToastDiv' v-html="text">
        </div>
      </div>
    </div>
  </div>

</template>
<style lang="less" rel="stylesheet/less">
  .i-toast-contain {
    position: fixed;
    top: e("calc(50% - 17.5PX)");
    width: 100%;
    z-index: 5001;
    @modalDuration: 400ms;
    .center-container.is-table {
      display: table;
      width: 100%;
      text-align: center;
    }

    .is-table .table-cell {
      display: table-cell;
      vertical-align: middle;
    }

    .is-table .center-block {
      max-width: 60%;
      margin: 0 auto;
      z-index: 11000;
      text-align: center;
      opacity: 0;
      transform: translate3d(0, 0, 0) scale(1.185);
      transition-property: transform, opacity;
      color: white;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 0.4em;
      padding: 0 12PX;
      min-height: 35PX;
      line-height: 35PX;
      font-size: 14PX;
      &.modal-in {
        opacity: 1;
        transition-duration: @modalDuration;
        transform: translate3d(0, 0, 0) scale(1);
      }
      &.modal-out {
        opacity: 0;
        z-index: 11000-1;
        transition-duration: @modalDuration;
        transform: translate3d(0, 0, 0) scale(0.815);
      }
    }
  }
</style>
<script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      },
      text: {
        type: String
      },
      time: {
        type: Number,
        default: 1500
      }
    },
    computed: {},
    data () {
      return {
        show: false
      }
    },
    created () {
      if (this.value) {
        this.show = true
      }
    },
    watch: {
      show (val) {
        if (val) {
          this.$emit('input', true)
          this.$nextTick(() => {
            let modal = document.getElementById('iToastDiv')
            let size = textSize('14PX', this.text)
            if (size.width + 12 * 2 < modal.offsetWidth && modal.offsetWidth) {
              modal.style.width = size.width + 'PX'
            } else {
              modal.style.width = '80%'
            }
            removeClass(modal, 'modal-out')
            addClass(modal, 'modal-in')
            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
              removeClass(modal, 'modal-in')
              addClass(modal, 'modal-out')
              setTimeout(() => {
                removeClass(modal, 'modal-out')
                modal.style.width = '80%'
                this.show = false
                this.$emit('input', false)
              }, 500)
            }, this.time)
          })
        }
      },
      value (val) {
        this.show = val
      }
    }
  }

  // region utils

  // 计算字符串宽度
  function textSize (fontSize, text) {
    let span = document.createElement('span')
    let result = {}
    result.width = span.offsetWidth
    result.height = span.offsetWidth
    span.style.visibility = 'hidden'
    document.body.appendChild(span)
    if (typeof span.textContent !== 'undefined') {
      span.textContent = text
    } else {
      span.innerText = text
    }
    result.width = span.offsetWidth - result.width
    result.height = span.offsetHeight - result.height
    span.parentNode.removeChild(span)
    return result
  }

  function addClass (el, className) {
    if (el.classList) {
      el.classList.add(className)
    } else {
      el.className += ' ' + className
    }
  }

  function removeClass (el, className) {
    if (el.classList) {
      el.classList.remove(className)
    } else {
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
    }
  }

  // endregion
</script>
