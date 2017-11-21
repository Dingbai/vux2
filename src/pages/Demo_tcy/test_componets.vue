<template>
    <div class="password-contain">
        <flexbox :gutter="0">
            <flexbox-item :span="1/3"></flexbox-item>
        </flexbox>
        <x-header >标题</x-header>

    </div>
</template>

<script>
    import {Flexbox, FlexboxItem, XHeader } from 'vux'
    export default {
        components: {
            Flexbox, FlexboxItem, XHeader
        },
        data() {
            return {}
        },
        computed: {},
        created() {
        },
        beforeDestroy() {
        },
        mounted() {
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                // 通过 `vm` 访问组件实例
            })
        },
        beforeRouteLeave(to, from, next) {
            // 导航离开该组件的对应路由时调用
            // 可以访问组件实例 `this`
            next()
        },
        methods: {}
    }
</script>

<style lang="less" rel="stylesheet/less">
    .password-contain {
        background-color: #fff;
    }
</style>
