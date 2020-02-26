// pages/info/info.js

const { fetchFunc } = require('../../miniprogram_npm/icbsc-fetch.js/index.js');
const url = "http://example.com"

//获取应用实例
const app = getApp()

const testRecord = '{"data":[{"mpiId":"f0089f5e-344c-489a-8dd1-1389e3f3746c","pid":"29056","times":"0","record":"xml1"},{"mpiId":"f0089f5e-344c-489a-8dd1-1389e3f3746c","pid":"29053","times":"1","record":"xml2"}],"errorMessage":"","success":true}'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: null,
    index: -1,
  },

  getRecordButton: function () {
    if (!this.data.data || this.data.index < 0) {
      wx.showModal({
        title: '查询病人病例错误',
        content: '无可查询病例',
        showCancel: false,
      })
      return
    }
    
    let record = this.data.data[this.data.index]
    console.debug("getRecord para: ", record)
    let fetch = fetchFunc()
    fetch(app.globalData.server + "/GetPatientRecord", {
      method: 'POST',
      body: {
        mpiId: record.mpiId,
        times: record.times,
      }
    }).then(
      response => {
        response.json().then(
          record => {
            if (record.success || record.success == "true") {
              app.globalData.record = record.data
              wx.navigateTo({
                url: '../record/record',
              })
            } else {
              console.error('getRecord error', record.errorMessage)
              wx.showModal({
                title: '查询病人电子病例错误',
                content: record.errorMessage,
                showCancel: false,
              })
            }
          },
          error => {
            console.error('getRecord JSON parser error', error)
            wx.showModal({
              title: '查询病人电子病例JSON解析错误',
              content: JSON.stringify(error),
              showCancel: false,
            })
          }
        )
      },
      error => {
        console.error('getRecord request error', error)
        wx.showModal({
          title: '查询病人电子病例网络错误',
          content: JSON.stringify(error),
          showCancel: false,
        })
      }
    )
  },

  radioChange: function (e) {
    console.debug('选择 record index 为：', e.detail.value)
    this.setData({
      index: e.detail.value,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      data: app.globalData.info,
      index: app.globalData.info && app.globalData.info.length > 0? 0:-1,
    })
    console.debug(this.data)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.setData({
      data: null,
      index: -1,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})