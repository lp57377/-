//pages/history/history.js
const app = getApp()

Page({
  data: {
    historyText: []
  },
  onShow: function() {
    this.setData({historyText: wx.getStorageSync('historyText')})
  },
  onTapItem: function(e) {
    wx.reLaunch({
      url: `/pages/index/index?query=${e.currentTarget.dataset.query}`
    })
  }
})