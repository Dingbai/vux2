<template>
  <div>
    <h3>test</h3>
    <h3>test</h3>
    <h3>test</h3>
    <h3>test</h3>
    <h3>test</h3>
    <h3>test</h3>
    <h3>test</h3>
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
