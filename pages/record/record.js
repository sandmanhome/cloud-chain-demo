// pages/record/record.js
const app = getApp()

const { Api, JsonRpc, JsSignatureProvider, Serialize } = require('../../miniprogram_npm/icbsc.js/index.js')
const { fetchFunc } = require('../../miniprogram_npm/icbsc-fetch.js/index.js');
const { TextDecoder, TextEncoder } = require('../../miniprogram_npm/icbsc-text-encoding.js/index.js')
const privateKey1 = "PVT_SM2_hrjc7PFDDjSNgGdsP33uXMBeV2abGzNHumnPyMhfhiCbXoKMh"
const privateKeys = [privateKey1];
const signatureProvider = new JsSignatureProvider(privateKeys);
const rpc = new JsonRpc(app.globalData.nodeserver, { fetch: fetchFunc() });
const textDecoder = new TextDecoder('utf-8')
const textEncoder = new TextEncoder()
const api = new Api({ rpc, signatureProvider, textDecoder, textEncoder });


Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: null,
    index: -1,
  },

  // 用于上链后 查询区块 检验用
  getDeserializeContextFreeData: function(blockNum) {
    setTimeout(function() {
      rpc.get_block(blockNum).then(res => {
        var data = res.transactions[0].trx.packed_context_free_data
        var uintData = Serialize.hexToUint8Array(data)
        var rawdatas = api.deserializeContextFreeData(uintData)
        let datastr
        for (let i in rawdatas) {
          datastr = textDecoder.decode(new Uint8Array(rawdatas[i]))
          console.debug('查询区块数据:', datastr)
        }
      })
    }, 500);
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

    let record = this.data.data[this.data.index]
    console.debug("pushRecord: ", record)

    let context_free_data = []
    try {
      // 解码后上链
      let recordbuf = wx.base64ToArrayBuffer(record.record)
      context_free_data.push(new Uint8Array(recordbuf))
    } catch(e) {
      wx.showModal({
        title: '病例上链序列化预处理错误',
        content: JSON.stringify(err, null, 2),
        showCancel: false,
      })
      return
    }

    api.transact({
      actions: [{
        account: 'icbs.test',
        name: 'addrecord',
        authorization: [{
          actor: 'xiaobaiyang3',
          permission: 'active'
        }],
        data: {
          mpiId: record.mpiId,
          pid: record.pid,
          times: record.times
        }
      }],
      context_free_data,
    }, {
        blocksBehind: 3,
        expireSeconds: 150
      }).then(result => {
        console.log(result)
        wx.showModal({
          title: '病例上链成功',
          content: JSON.stringify(result, null, 2),
          showCancel: false,
        })

        //测试上链数据是否正确
        this.getDeserializeContextFreeData(result.processed.block_num)
      }).catch(err => {
        console.log(err)
        wx.showModal({
          title: '病例上链错误',
          content: JSON.stringify(err, null, 2),
          showCancel: false,
        })
      })
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

    // base64解码
    let recordstr
    let recordbuf
    try {
      recordbuf = wx.base64ToArrayBuffer(this.data.data[this.data.index].record)
      console.log(recordbuf)
      recordstr = textDecoder.decode(new Uint8Array(recordbuf))
      console.log(recordstr)
    } catch (err) {
      wx.showModal({
        title: '展示病人病例xml解码错误',
        content: JSON.stringify(err, null, 2),
        showCancel: false,
      })
      return
    }

    // 解码后的xml
    app.globalData.recordxml = recordstr
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