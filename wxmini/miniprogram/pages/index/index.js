//index.js
import { translate } from '../../utils/api.js'
const app = getApp()
Page({
  data:{
    query:'',
    hideClearIcon: true,
    result: [],
    curLang: {},
    rawImage: null
  },
  onLoad: function (options){
    // console.log('lonload')
    // console.log(options,55)
    if(options.query) {
      this.setData({query: options.query})
    }
  },
  onShow: function(){
    // console.log(this.data.curLang.lang)
    // console.log(app.globalData.curLang.lang)
    if(this.data.curLang.lang !== app.globalData.curLang.lang) {
      this.setData({curLang: app.globalData.curLang})
      this.onConfirm()
    }
  },
  onInput: function(e) {
    // console.log(e.detail.value)
    this.setData({'query': e.detail.value})
    if(this.data.query.length > 0) {
      this.setData({'hideClearIcon':false})
    }else{
      this.setData({ 'hideClearIcon': true})
    }
  },
  onTapClose: function(){
    this.setData({query: '',hideClearIcon: true})
  },
  onConfirm: function(){
    // console.log(this.data,'55')
    if(!this.data.query) return
    translate(this.data.query,{from:'auto',to: this.data.curLang.lang}, 1).then(res=>{
      this.setData({'result': res.trans_result})
      
      console.log(wx.getStorageSync('historyText'))
      let historyText = wx.getStorageSync('historyText') || []
      historyText.unshift({query: this.data.query, result: res.trans_result[0].dst})
      historyText.length = historyText.length > 10 ? 10 : historyText.length
      wx.setStorageSync('historyText', historyText)
    })
  }
})