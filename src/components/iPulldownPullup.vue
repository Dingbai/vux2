<template>
  <div class="axon-load">
    <div class="first-load-div" v-if="firstLoad">
      <spinner type="ios-small"></spinner>
      <span class="pull-txt">正在加载更多数据</span>
    </div>
    <scroller lock-x scrollbar-y :use-pullup="usePullup" :use-pulldown="usePulldown" :height="scrollHeight+'px'"
              v-model="status"
              @on-pullup-loading="loadMore" @on-pulldown-loading="refresh" :pulldownConfig="pulldownConfig"
              ref="scrollerDemo">
      <!--content slot-->
      <slot></slot>
      <!--pullup slot-->
      <div slot="pullup" class="xs-plugin-pullup-container xs-plugin-pullup-up"
           v-show="usePullup&&status.pulldownStatus!=='down'&&status.pulldownStatus!=='up'&&status.pulldownStatus!=='loading'"
           style="position: absolute; width: 100%; height: 40px; bottom: -40px; text-align: center;">
        <span v-show="status.pullupStatus === 'default'"></span>
        <span class="pullup-arrow"
              v-show="status.pullupStatus === 'default' || status.pullupStatus === 'up' || status.pullupStatus === 'down'"
              :class="{'rotate': status.pullupStatus === 'down'}">↑ </span>
        <span class="pull-txt"
              v-show="status.pullupStatus === 'default' || status.pullupStatus === 'up'">上拉可以加载更多</span>
        <span class="pull-txt" v-show="status.pullupStatus === 'down'">松开立即加载更多</span>
        <span v-show="status.pullupStatus === 'loading'"><spinner type="ios-small"></spinner><span class="pull-txt">正在加载更多数据</span></span>
        <span class="pull-txt" v-show="status.pullupStatus === 'disabled'">已经全部加载完毕</span>
      </div>
      <!--pulldown slot-->
      <div slot="pulldown" class="xs-plugin-pulldown-container xs-plugin-pulldown-down"
           style="position: absolute; width: 100%; height: 40px; line-height: 40px; top: -40px; text-align: center;">
        <span v-show="status.pulldownStatus === 'default'"></span>
        <span class="pulldown-arrow" v-show="status.pulldownStatus === 'down' || status.pulldownStatus === 'up'"
              :class="{'rotate': status.pulldownStatus === 'up'}">↓</span>
        <span class="pull-txt" v-show="status.pulldownStatus === 'down'">下拉可以刷新</span>
        <span class="pull-txt" v-show="status.pulldownStatus === 'up'">松开立即刷新</span>
        <span v-show="status.pulldownStatus === 'loading'"><spinner type="ios-small"></spinner><span class="pull-txt">正在加载更多数据</span></span>
      </div>
    </scroller>
  </div>
</template>

<script>
  import { Scroller, Spinner, Flexbox, FlexboxItem, LoadMore } from 'vux'

  export default {
    components: {
      Scroller, Spinner, Flexbox, FlexboxItem, LoadMore
    },
    props: {
      bottomHeight: {
        type: Number,
        default: 100
      },
      usePulldown: {
        type: Boolean,
        default: true
      },
      usePullup: {
        type: Boolean,
        default: true
      },
      loadMore: Function,
      refresh: Function
    },
    methods: {
      refreshDone (isEnd) {
        this.$nextTick(() => {
          if (this.firstLoad) {
            this.firstLoad = false
            this.$refs.scrollerDemo.donePullup()
          }
          setTimeout(() => {
            this.$refs.scrollerDemo.donePulldown()
            this.usePullup && this.$refs.scrollerDemo.enablePullup()
            if (isEnd) {
              setTimeout(() => {
                this.$refs.scrollerDemo.disablePullup()
              }, 10)
            }
          }, 10)
        })
      },
      loadMoreDone (isEnd) {
        setTimeout(() => {
          this.$refs.scrollerDemo.donePullup()
          if (isEnd) {
            setTimeout(() => {
              this.$refs.scrollerDemo.disablePullup()
            }, 10)
          }
        }, 10)
      }
    },
    data () {
      return {
        firstLoad: true,
        status: {
          pullupStatus: 'default',
          pulldownStatus: 'loading'
        },
        pulldownConfig: {
          height: 40
        }
      }
    },
    computed: {
      scrollHeight: function () {
        let loadingHeight = this.firstLoad ? 28 : 0
        return this.$utils.Common.getWidthHeight().height - this.bottomHeight - loadingHeight
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  .axon-load {
    .first-load-div {
      text-align: center;
      width: 100%
    }
    .rotate {
      transform: rotate(180deg);
      -webkit-transform: rotate(180deg);
    }
    .pullup-arrow, .pulldown-arrow {
      transition: all linear 0.2s;
      -webkit-transition: all linear 0.2s;
      color: #666;
      font-size: 18px;
      display: inline-block;
    }
    .pull-txt {
      font-size: 13px;
    }
  }
</style>
