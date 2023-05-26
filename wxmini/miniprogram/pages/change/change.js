//change.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    curLang: {},
    langList: app.globalData.langList
  },
  onShow: function(){
    this.setData({ curLang: app.globalData.curLang})
  },
  onTapItem: function(e) {
    let langObj = e.currentTarget.dataset  //存储自定义属性
    // console.log(e.currentTarget.dataset)
    // console.log(e)
    wx.setStorageSync('curLang',langObj)
    this.setData({'curLang': langObj})
    app.globalData.curLang = langObj
    wx.switchTab({
      url: '/pages/index/index',
    })
  }
})