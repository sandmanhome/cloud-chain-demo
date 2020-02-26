//index.js
//获取应用实例
const app = getApp()

const testInfo = '{"data":[{"visitTime":"2012-11-30","diagnosis":" 高血压","mpiId":"f0089f5e-344c-489a-8dd1-1389e3f3746c","pid":"29056","times":"0","label":" 门诊"},{"visitTime":"2013-07-24","mpiId":"f0089f5e-344c-489a-8dd1-1389e3f3746c","diagnosis":"白内障","pid":"29053","times":"1","label":"住院"},{"visitTime":"2015-11-07","mpiId":"f0089f5e-344c-489a-8dd1-1389e3f3746c","diagnosis":"糖尿病","pid":"29054","times":"0","label":"门诊"},{"visitTime":"2016-11-07","mpiId":"f0089f5e-344c-489a-8dd1-1389e3f3746c","diagnosis":"脑中风","pid":"29053","times":"2","label":"住院"}],"errorMessage":"","success":true}'

Page({
  data: {
    pidType: 0,
    pid: "420106201101011919",
  },
  //事件处理函数
  getPidInfo: function() {
    console.debug("start getPidInfo")
  },

  pidTypeInput: function(e) {
    this.setData({
      pidType: e.detail.value
    })
  },
  pidInput: function (e) {
    this.setData({
      pid: e.detail.value
    })
  },

  getPidInfoButton: function() {
    console.debug("getPidInfo: ", this.data)
    try {
      let info = JSON.parse(testInfo);
      if (info.success || info.success == "true") {
        app.globalData.info = info.data
        wx.navigateTo({
          url: '../info/info',
        })
      } else {
        console.error('getPidInfo error', info.errorMessage)
        wx.showModal({
          title: '查询病人所有信息错误',
          content: info.errorMessage,
          showCancel: false,
        })
      }
    } catch(e) {
      console.error('getPidInfo JSON parser error', e.toString())
      wx.showModal({
        title: '查询病人所有信息错误',
        content: e.toString(),
        showCancel: false,
      })
    }
  },

  onLoad: function () {
    console.debug(this.data)
  },

  onUnload: function () {
    app.globalData.info = null,
    app.globalData.record = null,
    app.globalData.recordxml = null
  },
})
