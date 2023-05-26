const app = getApp()

Page({
  data:{
    imageUrl: "../Asset/images/8546021.jpg",
  },
  get_image: function(res){
    var that = this
    wx.chooseMedia({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res){
        const tempFilePaths = res.tempFiles[0].tempFilePath
        that.setData({
          imageUrl: tempFilePaths
        })
        console.log('Image Path is : ' + tempFilePaths)
        console.log(res)
      }
    })
  },
  recognition(res){
    if(!this.data.imageUrl) return
    translate(this.data.imageUrl,{from:'auto',to: this.data.curLang.lang}, 2).then(res=>{
      this.setData({'result': res.sumSrc})
      
      //console.log(wx.getStorageSync('history'))
      let history = wx.getStorageSync('history') || []
      history.unshift({query: this.data.query, result: res.trans_result[0].dst})
      history.length = history.length > 10 ? 10 : history.length
      wx.setStorageSync('history', history)
    })
  }
})