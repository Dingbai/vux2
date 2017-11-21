import Common from './common.js'
import Date from './date.js'
import LocalStorage from './localStorage.js'
import Validate from './validate.js'
import UserAgent from './useragent'
import Log from './log'

export const utils = {Common, Date, LocalStorage, Validate, UserAgent, Log}

export default {
  install (Vue) {
    Vue.prototype.$utils = utils
    Vue.$utils = utils
  },
  $utils: utils
}
