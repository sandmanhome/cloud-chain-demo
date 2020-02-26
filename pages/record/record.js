// pages/record/record.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: null,
    index: -1,
  },

  pushRecordButton: function () {
    if (!this.data.data || this.data.index < 0) {
      wx.showModal({
        title: '病人病例上链错误',
        content: '无可上链病人病例',
        showCancel: false,
      })
      return
    }

    // 上链
    console.debug("pushRecord: ", this.data)
  },

  viewRecordButton: function () {
    if (!this.data.data || this.data.index < 0) {
      wx.showModal({
        title: '展示病人病例xml错误',
        content: '无可展示病例xml',
        showCancel: false,
      })
      return
    }

    // base64
    app.globalData.recordxml = this.data.data[this.data.index].record
    wx.navigateTo({
      url: '../recordxml/recordxml',
    })
  },

  radioChange: function (e) {
    console.debug('选择 recordxml index 为：', e.detail.value)
    this.setData({
      index: e.detail.value,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      data: app.globalData.record,
      index: app.globalData.record && app.globalData.record.length > 0 ? 0 : -1,
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