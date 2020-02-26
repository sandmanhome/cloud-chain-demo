// pages/info/info.js
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

    console.debug("getRecord para: ", this.data.data[this.data.index])
    try {
      let record = JSON.parse(testRecord);
      if (record.success || record.success == "true") {
        app.globalData.record = record.data
        wx.navigateTo({
          url: '../record/record',
        })
      } else {
        console.error('getRecord error', record.errorMessage)
        wx.showModal({
          title: '查修病人病例错误',
          content: record.errorMessage,
          showCancel: false,
        })
      }
    } catch (e) {
      console.error('getRecord JSON parser error', e.toString())
      wx.showModal({
        title: '查询病人电子病例错误',
        content: e.toString(),
        showCancel: false,
      })
    }
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