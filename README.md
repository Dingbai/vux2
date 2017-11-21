# vux2

> vux2 模版项目

## Demo

<p align="center">
  <a href="https://poc.51pinzhi.cn/vux2/">https://poc.51pinzhi.cn/vux2/</a><br/>
  <img src="http://121.31.40.6/images/1468465684.png" width="300">
</p>

## Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:3059
yarn run dev

# build for production with minification
yarn run build
```

## 注意事项:
+ 建议使用yarn代替npm
  
  + [yarn中文官网](https://yarnpkg.com/zh-Hans/)
  + 替换yarn源为淘宝
  
  ``` bash
  yarn config set registry https://registry.npm.taobao.org
  ```
  
+ 打包时需修改发布路径 config\global.js 中build.assetsPublicPath

  + 如果没有二级目录，如 http://www.baidu.com/ ，这直接写为 '/'

  + 如果有二级目录，如 http://www.baidu.com/XXX ，则需写为 '/XXX/'

### 接口跨域
+ 本地
  + http-proxy-middleware [介绍](http://vuejs-templates.github.io/webpack/proxy.html)
+ 生产
  + nginx反向代理
  + 接口支持cors
  
  
### 线上调试
+ [eruda](https://github.com/liriliri/eruda) 
  + 在需要调试的页面url后加上debug=1，页面右下角会出现调试按钮，可以查看'console', 'network', 'sources'等信息
  + 代码参见App.vue的created()
  
### lib-flexible适配（new）
+ 默认启用rem，适配多终端 [lib-flexible介绍](https://github.com/amfe/article/issues/17)
  + 默认字体大小也会被转换，如不希望转换，参考 build\vue-loader.conf.js 内注释
  + 如某些自定义样式不希望被转换，请将px替换成PX，参考 src\pages\Demos\Flexible\Index\index.less 代码
  
+ 如不需使用：
  + index.html 注释 
  ```
  <script src="//poc.51pinzhi.cn/js/flexible.js"></script>
  ```
  + build\vue-loader.conf.js 注释 
  ```
  require('postcss-plugin-px2rem')({
        rootValue: 37.5,
        selectorBlackList: ['html'],
        mediaQuery: true,
        propBlackList: [] // 如果要保持font-size不转换，替换为 ['font-size']
      }),
  ```  
  + build\webpack.base.conf.js 注释 （这个不管其实也没什么影响）
  ```
  {
     name: 'after-less-parser',
     fn: function (source) {
       if (this.resourcePath.replace(/\\/g, '/').indexOf('/vux/src/components') > -1) {
         source = source.replace(/px/g, 'PX')
       }
       return source
     }
   },
   {
     name: 'style-parser',
     fn: function (source) {
       if (this.resourcePath.replace(/\\/g, '/').indexOf('/vux/src/components') > -1) {
         source = source.replace(/px/g, 'PX')
       }
       // 避免转换1PX.less文件路径
       if (source.indexOf('1PX.less') > -1) {
         source = source.replace(/1PX.less/g, '1px.less')
       }
       return source
     }
   }
  ```
