<template>
  <div class="container">
    <div class="clearfix"></div>
    <group title="常用辅助方法">
      <cell title="App保存Log" @click.native="buried" is-link></cell>
      <cell title="设备信息" @click.native="testDevice" is-link></cell>
      <cell title="时间辅助类" @click.native="testDateTime" is-link></cell>
      <cell title="LocalStorage（使用Triple DES 加密）" @click.native="testLocalStorage" is-link></cell>
    </group>
  </div>
</template>

<script>
  import { Group, Cell } from 'vux'

  export default{
    components: {
      Group, Cell
    },
    data () {
      return {
        dialogIsShow: false
      }
    },
    methods: {
      buried () {
        this.$utils.Log.saveBussiness('test')
        this.$vux.toast.show({text: '成功', type: 'success'})
      },
      testDevice () {
        this.$vux.alert.show({content: JSON.stringify(this.$device)})
      },
      testDateTime () {
        this.$vux.toast.show({text: '结果查看控制台'})

        // date帮助类demo
        // 所有date参数可传
        //   字符串类型 '2008-04-02 10:08:44','2008/04/02 10:08:44'
        //   Date类型 new Date()
        //   unix时间戳，数字字符串都可

        // 字符串类型
        console.log(this.$utils.Date.format('2008/04/02 10:08:44', 'yyyy-MM-dd hh:mm'))
        // Date类型
        console.log(this.$utils.Date.format(new Date('2008/04/02 10:08:44')))
        // Unix时间戳
        console.log(this.$utils.Date.format(1478163696))
        console.log(this.$utils.Date.format('1478163696'))
        // 比较两个时间先后
        console.log(this.$utils.Date.dateCompare('2008-04-02', '2008-04-03'))
        // 两个时间段之间日期
        console.log(this.$utils.Date.dataScope('2008-04-02', '2008-05-03'))
        // 增加时间
        // 参数：mon，day，hou，min，sec
        console.log(this.$utils.Date.add('2008-05-03 12:00:00', 11, 'mon'))
      },
      testLocalStorage () {
        this.$vux.toast.show({text: '结果查看控制台'})

        // 测试localstorage
        // 存入对象，还原成对象
        this.$utils.LocalStorage.set('haha1', {'aa': '12345678901234567890', bb: 123})
        let haha = this.$utils.LocalStorage.get('haha1')
        console.log('haha1:', haha, typeof haha)

        // 存入数字，还原成数字
        this.$utils.LocalStorage.set('haha2', 1000)
        let haha2 = this.$utils.LocalStorage.get('haha2')
        console.log('haha2:', haha2, typeof haha2)

        // 存入字符串，还原成字符串
        this.$utils.LocalStorage.set('haha3', '12345678901234567890')
        let haha3 = this.$utils.LocalStorage.get('haha3')
        console.log('haha3:', haha3, typeof haha3)
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    background-color: #fff;
  }
</style>
