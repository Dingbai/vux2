// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: process.env.NODE_ENV === 'testing' ? require('./test.env') : require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/pzvip/',  // 项目发布的二级目录
    productionSourceMap: false, // 打包时是否生成SourceMap
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: true, // 打包时是否生成Gzip
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    buried: false // 是否开启埋点
  },
  dev: {
    env: require('./dev.env'),
    port: 3059,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
    proxyTable: {
      // The above example will proxy the request /wxApi/posts/1 to http://wx.gx10010.com/posts/1.
      '/appApi': {
        target: 'https://api.pinzhi.xin/',
        changeOrigin: true,
        pathRewrite: {
          '^/appApi': ''
        }
      },
      '/sameOriginApi': {
        target: 'http://poc.51pinzhi.cn/',
        changeOrigin: true,
        pathRewrite: {
          '^/sameOriginApi': ''
        }
      },
      '/pocApi': {
        target: 'http://api.51pinzhi.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/pocApi': ''
        }
      },
      '/pocTestApi': {
        target: 'http://test.api.51pinzhi.cn',
        changeOrigin: true,
        pathRewrite: {
          '^/pocTestApi': ''
        }
      },
      '/double11Api': {
        target: 'https://poc.51pinzhi.cn/proxy',
        changeOrigin: true,
        pathRewrite: {
          '^/double11Api': ''
        }
      },
      '/test_double11Api': {
        target: 'http://test.poc.51pinzhi.cn/proxy',
        // target: 'http://localhost:3300/proxy',
        changeOrigin: true,
        pathRewrite: {
          '^/test_double11Api': ''
        }
      },
      '/douBan': {
        target: 'https://api.douban.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/douBan': ''
        }
      }
    },
    openUrlQuery: '' // 调试时，启动页面参数，例如 '/index?cryptPhone=ILUV/Y34vi7INGusxX/jMA=='
  }
}
