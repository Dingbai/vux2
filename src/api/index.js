import Vue from 'vue'

export default {
  getLocationInfo ({longtitude, lantitude}, op = {}) {
    Vue.$api.xHttp.get(`/appApi/v2/gps/GetAddress?longtitude=${longtitude}&lantitude=${lantitude}`, op)
  },
  loanCredit (udcid, op = {}) {
    Vue.$api.xHttp.get(`/appApi/v2/newloan/LoanCredit?udcid=${udcid}`, op)
  },
  testAll ({longtitude, lantitude, udcid}, op = {}) {
    Promise.all([
      Vue.$api.xHttp.get(`/appApi/v2/gps/GetAddress?longtitude=${longtitude}&lantitude=${lantitude}`, op),
      Vue.$api.xHttp.get(`/appApi/v2/newloan/LoanCredit?udcid=${udcid}`, op)
    ]).then(op.completeHanding).catch(op.exceptionHandling)
  },
  getdouban (bookindex, op = {}) {
    Vue.$api.xHttp.get(`/douban/v2/book/${bookindex}`, op)
  }
}
