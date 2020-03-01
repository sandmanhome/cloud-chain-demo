//index.js
const { fetchFunc } = require('../../miniprogram_npm/icbsc-fetch.js/index.js');

//获取应用实例
const app = getApp()

const testInfo = '{"data":[{"visitTime":"2012-11-30","diagnosis":" 高血压","mpiId":"f0089f5e-344c-489a-8dd1-1389e3f3746c","pid":"29056","times":"0","label":" 门诊"},{"visitTime":"2013-07-24","mpiId":"f0089f5e-344c-489a-8dd1-1389e3f3746c","diagnosis":"白内障","pid":"29053","times":"1","label":"住院"},{"visitTime":"2015-11-07","mpiId":"f0089f5e-344c-489a-8dd1-1389e3f3746c","diagnosis":"糖尿病","pid":"29054","times":"0","label":"门诊"},{"visitTime":"2016-11-07","mpiId":"f0089f5e-344c-489a-8dd1-1389e3f3746c","diagnosis":"脑中风","pid":"29053","times":"2","label":"住院"}],"errorMessage":"","success":true}'

Page({
  data: {
    IdType: 0,
    Pid: "29056",
  },
  //事件处理函数
  getPidInfo: function() {
    console.debug("start getPidInfo")
  },

  IdTypeInput: function(e) {
    this.setData({
      pidType: e.detail.value
    })
  },
  PidInput: function (e) {
    this.setData({
      pid: e.detail.value
    })
  },

  getPidInfoButton: function() {
    console.debug("getPidInfo: ", this.data)
    let fetch = fetchFunc()
    fetch(app.globalData.server + "/GetPatientIinfo", {
      method: 'POST',
      body: {
        Pid: this.data.Pid,
        IdType: this.data.IdType,
      }
    }).then (
      response => {
        response.json().then(
          info => {
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
          },
          error => {
            console.error('getPidInfo JSON parser error', error)
            wx.showModal({
              title: '查询病人所有信息JSON解析错误',
              content: JSON.stringify(error),
              showCancel: false,
            })
          }
        )
      },
      error => {
        console.error('getPidInfo request error', error)
        wx.showModal({
          title: '查询病人所有信息网络错误',
          content: JSON.stringify(error),
          showCancel: false,
        })
      }
    )
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
