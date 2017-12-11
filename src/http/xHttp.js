import Vue from 'vue'
import axios from 'axios'
// import config from '../../config'
// 通用接口业务成功判定条件
const DEF_VALIDATOR = (res) => res.ErrorCode === '000000'
// 通用接口业务失败处理
const DEF_FAIL_HANDLING = (res) => Vue.$vux.alert.show({content: res.Msg})
// 通用接口异常处理
const DEF_EXCEPTION_HANDLING = msg => Vue.$vux.alert.show({ content: msg || '传输异常，请稍后再试' })
// 默认接口延迟300毫秒
const DEF_DELAY = 300
// 埋点接口详情
// {
//   "RequestUri":"xxx",    //全路径uri
//   "RequestType":1,    //1 Post    2 Get  默认值为1
//   "RequestMethod":"xxx",    //调用接口的方法名    默认为null
//   "RequestInput":"xxx",    //调用接口的入参    默认为null
//   "RequestOutput":"xxx"    //调用接口的出参    默认为null
// }
let RequestInfo = null

function successParse (res, load, validator, completeHanding, successHanding, failHandling, type, buried, delay, BatchId, exceptionHandling) {
  // 避免loading动画一闪而过，增加0.3秒延迟
  let time = load ? delay : 0
  if (delay > DEF_DELAY) {
    time = delay
  }
  const obj = res.data
  // 业务埋点
  if (buried) {
    RequestInfo.RequestOutput = res.data === Object(res.data) ? JSON.stringify(obj) : obj
    Vue.$utils.Log.saveApi(0, null, validator(obj) ? 0 : 1, null, RequestInfo, BatchId)
  }
  if (type === 0 || type === 2) {
    setTimeout(() => {
      if (load) {
        if (load === 'btn') {
          window.$globalHub.$store.commit('UPDATE_BTNLOADINGSTR', null)
        } else {
          Vue.$vux.loading.hide()
        }
      }
      try {
        // 接口完成处理
        type === 0 && completeHanding()
        // 验证接口结果
        if (validator(obj)) {
          // 业务成功处理
          successHanding(obj)
        } else {
          type === 2 && completeHanding()
          // 业务失败处理
          failHandling(obj)
        }
      } catch (e) {
        console.log('successParseEx:', e)
        completeHanding()
        exceptionHandling('网络异常，请稍后再试')
      }
    }, time)
  } else {
    return obj
  }
}

function errorParse (error, load, completeHanding, exceptionHandling, type, buried, BatchId) {
  // 接口异常埋点
  if (buried) {
    try {
      if (error.response) {
        RequestInfo.RequestOutput = JSON.stringify(error.response)
      } else if (error.request) {
        RequestInfo.RequestOutput = JSON.stringify(error.request)
      } else {
        RequestInfo.RequestOutput = JSON.stringify(error.message)
      }
    } catch (e) {
    }
    Vue.$utils.Log.saveApi(1, null, 1, null, RequestInfo, BatchId)
  }
  if (load) {
    if (load === 'btn') {
      window.$globalHub.$store.commit('UPDATE_BTNLOADINGSTR', null)
    } else {
      Vue.$vux.loading.hide()
    }
  }
  // 接口完成处理
  if (type === 0 || type === 2) {
    completeHanding()
  }
  // 接口异常处理
  let status = -1
  let data
  if (error.response) {
    status = error.response.status
    data = error.response.data
  }
  if (type === 0 || type === 2) {
    exceptionHandling({status, data})
  } else {
    return Promise.reject({status, data})
  }
}

function requestUrl (url) {
  // 测试/生成环境
  if (process.env.NODE_ENV !== 'development') {
    if (url.startsWith('/sameOriginApi')) {
      console.log('sameorigin')
      // 同域名下还原请求地址
      url = url.replace('/sameOriginApi', '')
    } else if (!url.startsWith('http')) {
      console.log('httpsameorigin')
      // 测试环境
      if (process.env.NODE_ENV === 'testing') {
        console.log('testing')
        if (url.startsWith('/appApi')) {
          // 测试环境，访问test接口
          url = url.replace('v2', 'test')
        }
      }
      // 线上地址加上项目名区分
      // url = config.build.assetsPublicPath + url.substring(1)
      url = '/proxy/' + url.substring(1)
    } else if (url.startsWith('/douBan')) {
      console.log('url')
      return url
    }
  } else {
    if (url.startsWith('/appApi')) {
      // 测试环境，访问test接口
      url = url.replace('v2', 'test')
    }
  }
  return url
}

function send (url, method, body, options, load, loadMsg, loadID, validator, completeHanding, successHanding, failHandling, exceptionHandling, type, buried, delay) {
  // 生成请求url
  url = requestUrl(url)
  let buriedParam = {}
  // 接口开始埋点
  if (buried) {
    RequestInfo = {
      RequestUri: url,
      RequestType: method === 'get' ? 1 : 2,
      RequestMethod: url.split('?')[0],
      RequestInput: method === 'get' ? (url.indexOf('?') > -1 ? url.split('?')[1] : null) : JSON.stringify(body),
      RequestOutput: null
    }
    let BatchId = Vue.$utils.Common.guid()
    Vue.$utils.Log.saveApi(0, null, 0, null, RequestInfo, BatchId)
    buriedParam = Vue.$utils.Log.buriedParam(BatchId)
  }
  if (type === 1 || type === 2) {
    load = false
  }
  if (load) {
    if (load === 'btn') {
      window.$globalHub.$store.commit('UPDATE_BTNLOADINGSTR', {str: loadMsg, id: loadID})
    } else {
      Vue.$vux.loading.show(loadMsg)
    }
  }
  const opts = {...options}
  opts.headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...buriedParam,
    ...opts.headers
  }
  return axios({
    method,
    url,
    data: body,
    ...opts
  }).then(res => successParse(res, load, validator, completeHanding, successHanding, failHandling, type, buried, delay, buriedParam.BatchId, exceptionHandling))
    .catch(error => errorParse(error, load, completeHanding, exceptionHandling, type, buried, buriedParam.BatchId))
}

export default {
  /**
   * 调用Get接口
   * @param url 接口地址
   * @param options axios的options设置（参考https://github.com/mzabriskie/axios）
   * @param type 调用类型（默认0：单个调用，1：并发调用，2：连续调用）
   * @param load  是否展示loading (true：默认，展示全屏loading框，false：不展示，btn：展示按钮loading)
   * @param loadMsg loading展示文字
   * @param loadID loading按钮标识（用以多个loadingBtn的情况，默认为null）
   * @param validator 业务成功逻辑判断
   * @param completeHanding 接口完成处理（主要用于关闭loading操作）
   * @param successHanding 业务成功处理
   * @param failHandling 业务失败处理
   * @param exceptionHandling 接口异常处理
   * @param buried 是否添加接口埋点
   * @param delay 接口延迟时间，默认300
   */
  get (url, {options = null,
    type = 0,
    load = true,
    loadMsg = '加载中...',
    loadID = null,
    validator = DEF_VALIDATOR,
    completeHanding = () => {},
    successHanding = () => {},
    failHandling = DEF_FAIL_HANDLING, exceptionHandling = DEF_EXCEPTION_HANDLING, buried = true,
    delay = DEF_DELAY} = {}) {
    return send(url, 'get', null, options, load, loadMsg, loadID, validator, completeHanding, successHanding, failHandling, exceptionHandling, type, buried, delay)
  },
  /**
   * 调用Post接口
   * @param url 接口地址
   * @param body 接口参数
   * @param options axios的options设置（参考https://github.com/mzabriskie/axios）
   * @param type 调用类型（默认0：单个调用，1：并发调用，2：连续调用）
   * @param load  是否展示loading (true：默认，展示全屏loading框，false：不展示，btn：展示按钮loading)
   * @param loadMsg loading展示文字
   * @param loadID loading按钮标识（用以多个loadingBtn的情况，默认为null）
   * @param validator 业务成功逻辑判断
   * @param completeHanding 接口完成处理（主要用于关闭loading操作）
   * @param successHanding 业务成功处理
   * @param failHandling 业务失败处理
   * @param exceptionHandling 接口异常处理
   * @param buried 是否添加接口埋点
   * @param delay 接口延迟时间，默认300
   */
  post (url, body, {options = null, type = 0, load = true, loadMsg = '加载中...', loadID = null, validator = DEF_VALIDATOR, completeHanding = () => {}, successHanding = () => {}, failHandling = DEF_FAIL_HANDLING, exceptionHandling = DEF_EXCEPTION_HANDLING, buried = true, delay = DEF_DELAY} = {}) {
    return send(url, 'post', body, options, load, loadMsg, loadID, validator, completeHanding, successHanding, failHandling, exceptionHandling, type, buried, delay)
  },
  /**
   * tcy的测试接口
   * @param url
   * @param successHanding 成功回调
   */
  myget (url, { successHanding = () => {} }) {
    return axios.get(url).then(function (res) {
      // const obj = JSON.parse(res)
      successHanding(res)
    })
  }
}
