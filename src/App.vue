<template>
  <div id="app" style="height:100%;">
    <view-box ref="AppViewBox">
      <!--region 遮罩层-->
      <div class="weui-mask transparent" v-show="showMask"></div>
      <!--endregion-->
      <!--region 主体内容-->
      <div :class="pageClass">
        <!--region 顶部留白-->
        <div class="clearfix span" v-if="showTopSpace"></div>
        <!--endregion-->
        <transition :name="transitionName" @after-enter="afterEnter">
          <router-view class="router-view"></router-view>
        </transition>
      </div>
      <!--endregion-->
      <!--region 底部提示-->
      <footer class="site-footer" v-show="showFoot">
        <p class="weui-footer__links">
          <a href="javascript:void(0);" class="weui-footer__link">底部链接</a>
          <a href="javascript:void(0);" class="weui-footer__link">底部链接</a>
        </p>
        <p class="weui-footer__text">Copyright © 2008-2016 weui.io</p>
      </footer>
      <!--endregion-->
    </view-box>
    <!--region 预加载loading按钮动画-->
    <div class="weui-loading_pre1"></div>
    <div class="weui-loading_pre2"></div>
    <!--endregion-->
  </div>
</template>

<script>
  import { ViewBox, Loading } from 'vux'
  import { mapState } from 'vuex'

  export default {
    components: {
      ViewBox, Loading
    },
    created () {
      // support eruda
      // more info https://github.com/liriliri/eruda
      if (this.$utils.Common.getParam('debug')) {
        const script = document.createElement('script')
        script.src = '//cdn.jsdelivr.net/npm/eruda'
        document.body.appendChild(script)
        script.onload = function () { window.eruda.init({tool: ['console', 'network', 'sources']}) }
      }
    },
    beforeDestroy () {},
    data () {
      return {
        transition: 'go'
      }
    },
    computed: {
      ...mapState({
        direction: ({global}) => global.direction,
        showTopSpace: ({global}) => global.showTopSpace,
        showFoot: ({global}) => global.showFoot,
        showMask: ({global}) => global.showMask
      }),
      transitionName () {
        return 'vux-pop-' + (this.direction === 'forward' ? 'in' : 'out')
      },
      pageClass () {
        if (this.showFoot) {
          return 'page-wrap'
        } else {
          if (this.showTopSpace) {
            return 'no-page-wrap top'
          }
          return 'no-page-wrap'
        }
      }
    },
    methods: {
      afterEnter () {
        // 过场动画完成后
        // 默认展示底部提示，不需要的页面需设置meta.noFoot = true
        this.$store.commit('SHOW_FOOT', !this.$route.meta.noFoot)
        // 去除全屏遮罩
        this.$store.commit('SHOW_MASK', false)
      }
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';
  @import '~vux/src/styles/1px.less';
  @import "assets/styles/global/close";
  @import "assets/styles/App/common";
  @import "assets/styles/App/custom";
</style>
