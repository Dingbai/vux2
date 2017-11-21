<template>
  <div>
  </div>
</template>
<script>
import BLL from './Index'

export default {
  data () {
    return {}
  },
  created () {
    // 初始化
    this.BLL = new BLL(this)
    this.BLL.init()
  },
  computed: {},
  watch: {}
}
</script>
