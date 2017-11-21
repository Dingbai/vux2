var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV !== 'development'
module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  }),
  postcss: [
    require('postcss-plugin-px2rem')({
      rootValue: 75, // 这里对应的是750的设计图尺寸
      selectorBlackList: ['html'],
      mediaQuery: true,
      propBlackList: ['border-radius', 'border'] // 如果要保持font-size不转换，替换为 ['font-size']
    }),
    require('autoprefixer')({
      browsers: ['iOS >= 7', 'Android >= 4.1']
    })
  ]
}
