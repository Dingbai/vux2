import Vue from 'vue'
import common from './common'
import config from '../../../config'

const ModName = require('../../../package.json').name

/**
 * 获取用户唯一标示
 * @returns {*}
 */
function getUserID () {
  return window.$globalHub.$store.getters.udcid
}

/**
 * 获取流程名称（注意不能有中文）
 * @returns {*}
 */
function getPathName () {
  let route = window.$globalHub.$store.getters.route
  // if (route.meta.modeName === 'result') {
  //   return window.$globalHub.$store.getters.quota ? 'large' : 'small'
  // }
  return route.meta.modeName || 'app'
}

/**
 * 获取项目名
 */
function getModName () {
  return ModName
}

function saveLog (userphone, page, eventname, activename, channel) {
  let postData = {
    'userid': 0,
    'userphone': userphone,
    pagename: page,
    pageurl: window.location.href,
    eventname: eventname,
    activename: activename,
    channel: common.getParam('channel') || channel,
    flag: 0
  }
  if (process.env.NODE_ENV !== 'development') { // 生产环境
    if (config.build.buried) {
      Vue.$api.xHttp.post('/appApi/v2/credit/log', postData, {
        load: false,
        exceptionHandling: () => {},
        failHandling: () => {},
        buried: false,
        options: {
          timeout: 500
        }
      })
    }
  } else {
    // console.log('postData:', postData)
  }
}

function saveLogNew (PageName, EName, EDesc, ProcName, UDCID, CalledResult, Description, BussinessSuccess, BussinessDesc, InputParams, OutputParams, RequestInfo, BatchId = null) {
  const postData = {
    ModName: getModName(), // 模块名称
    ProcName: ProcName, // 流程名称
    LaunchId: UDCID, // 流程发起人（UDCID）
    Token: window.$globalHub.$store.getters.guid, // 流程Token
    ParentSeq: -1, // 父级队列序号
    Seq: window.$globalHub.$store.getters.route.path.split('?')[0] + '_' + window.$globalHub.$store.getters.seq, // 当前队列顺序号 格式 特殊标识_Num
    BuriedTime: Math.round(new Date().getTime() / 1000), // 埋点时间 unix时间戳
    CalledResult: CalledResult, // 对方接口调用是否成功 0成功(默认)     1失败    非接口调用 -1
    Description: Description, // 对方接口调用描述
    BussinessSuccess: BussinessSuccess, // 当前自身业务逻辑是否成功 0成功(默认) 1失败
    BussinessDesc: BussinessDesc, // 业务逻辑描述
    InputParams: InputParams, // 当前接口方法入参
    OutputParams: OutputParams, // 当前接口方法出参 默认为null
    HeaderParams: null, // 当前Header头参数 默认为null
    PageUri: window.location.href, // 页面地址
    PageName: PageName, // 页面名称
    EName: EName, // 事件名称
    EDesc: EDesc, // 事件描述
    UserAgent: window.navigator.userAgent,
    Source: 'APP_H5', //必填 调用源
    ErrorCode: null,    //错误码   默认为null        和   TrgAlarm 配合使用
    RequestInfo: RequestInfo,
    BatchId: BatchId // 批次ID
  }
  if (process.env.NODE_ENV === 'production') { // 生产环境
    if (config.build.buried) {
      Vue.$api.xHttp.post('/sameOriginApi/Burieds/Buried/HBuried', postData, {
        load: false,
        exceptionHandling: () => {},
        failHandling: () => {},
        buried: false,
        options: {
          timeout: 500
        }
      })
    }
  } else if (process.env.NODE_ENV === 'testing') { // 测试环境
    if (config.build.buried) {
      Vue.$api.xHttp.post('/testBuried/Burieds/Buried/HBuried', postData, {
        load: false,
        exceptionHandling: () => {},
        failHandling: () => {},
        buried: false,
        options: {
          timeout: 500
        }
      })
    }
  } else {
    // console.log('postData:', postData)
  }
}

export default {
  appSave (eventname) {
    let route = window.$globalHub.$store.getters.route
    saveLog(getUserID(), route.meta.name || route.path.split('?')[0], eventname, getModName(), 'APP')
    this.saveBussiness(eventname)
  },
  appRouter () {
    let route = window.$globalHub.$store.getters.route
    saveLog(getUserID(), route.meta.name || route.path.split('?')[0], '进入', getModName(), 'APP')
    this.saveRouter()
  },
  getPathName () {
    return getPathName()
  },
  getModName () {
    return getModName()
  },
  /**
   * 路由埋点
   */
  saveRouter () {
    let route = window.$globalHub.$store.getters.route
    // 还原seq
    window.$globalHub.$store.commit('INIT_SEQ')
    saveLogNew(route.meta.name || route.path.split('?')[0], 'PageLoad', '页面加载', getPathName(), getUserID(), -1, null, 0, null, null, null, null)
  },
  /**
   * 自身业务逻辑埋点
   * @param BussinessDesc 业务逻辑描述
   * @param EName 事件名称（默认 click）
   * @param EDesc EDesc （默认 点击事件）
   */
  saveBussiness (BussinessDesc, EName = 'click', EDesc = '点击事件') {
    let route = window.$globalHub.$store.getters.route
    // 增加seq
    window.$globalHub.$store.commit('ADD_SEQ')
    saveLogNew(route.meta.name || route.path.split('?')[0], EName, EDesc, getPathName(), getUserID(), -1, null, 0, BussinessDesc, null, null, null)
  },
  /**
   * 调用接口埋点
   * @param CalledResult  对方接口调用是否成功 0成功(默认)     1失败    非接口调用 -1
   * @param Description 对方接口调用描述
   * @param BussinessSuccess  当前自身业务逻辑是否成功 0成功(默认) 1失败
   * @param BussinessDesc 业务逻辑描述
   * @param RequestInfo 接口详情
   * @param BatchId 批次ID
   */
  saveApi (CalledResult, Description, BussinessSuccess, BussinessDesc, RequestInfo, BatchId) {
    let route = window.$globalHub.$store.getters.route
    // 增加seq
    window.$globalHub.$store.commit('ADD_SEQ')
    saveLogNew(route.meta.name || route.path.split('?')[0], null, null, getPathName(), getUserID(), CalledResult, Description, BussinessSuccess, BussinessDesc, null, null, RequestInfo, BatchId)
  },
  buriedParam (BatchId) {
    return {
      ModName: getModName(),    //项目名称 e.g pzgo
      ProcName: getPathName(),    //流程名称 e.g active1
      LaunchId: getUserID(),    //流程发起人（UDCID）
      Token: window.$globalHub.$store.getters.guid,  //    流程Token
      Seq: window.$globalHub.$store.getters.route.path.split('?')[0] + '_' + window.$globalHub.$store.getters.seq,//当前队列顺序号
      BatchId // 批次ID
    }
  }
}
