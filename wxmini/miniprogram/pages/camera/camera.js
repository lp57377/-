import { translate } from '../../utils/api.js'

const app = getApp()

Page({
  data:{
    imageUrl: "../Asset/images/8546021.jpg",
    baiduToken: "",
    result:[],
    translate_result:[],
    query:'',
  },
  getBaiduToken: function(){
    var apiKey = 'SPN42umde7YW16akGflcyi3e';    
    var secKey = 'dKNLl9wHN9zjW7Lib4DLdiO31ZZj2X9d';    
    var tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secKey}`;    
    var that = this;    
    wx.request({        
      url: tokenUrl,        
      method: 'POST',        
      dataType: 'json',        
      header:{            
        'content-type': 'application/json; charset-UTF-8'        
      },        
      success: function(res){            
        console.log("[BaiduToken获取成功]",res);            
        that.setData({                
          baiduToken: res.data.access_token            			
        	})        
      },        
      fail: function(res){            
        console.log("[BaiduToken获取失败]",res);
      }    
    })  
  },

  // 百度ORC接口调用  
scanImageInfo: function(imageData){    // 这里的imageData是图片转换成base64格式的数据
	var that = this;
	const detectUrl = `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${that.data.baiduToken}`
  	return new Promise(function(resolve,reject){        
		wx.request({            
			url: detectUrl,            
			data: {                
				image: imageData            
			},            
			method: 'POST',            
			dataType: 'json',            
			header:{                
				'content-type': 'application/x-www-form-urlencoded'    // 必须的        
			},            
			success: function(res, resolve){              
				console.log('get word success：',res.data);              
        var word = res.data.words_result[0].words  
        that.setData({'result': res.data.words_result})  	
        var query = res.data.words_result.map((obj)=>{return obj.words}).join();
        that.setData({'query':query})
				console.log(word);            
			},            
			fail : function(res,reject){              
				console.log('get word fail：',res.data);           			},            

		})
	}) 
},

doUpload: function () {
	var that = this    
	that.getBaiduToken()    // 提前获取access_Token
	// 选择图片，拍照或从相册中获取
	wx.chooseImage({      
		count: 1,      
		sizeType: ['compressed'],      
		sourceType: ['album', 'camera'],      
		success: function (res) {
      that.setData({
        imageUrl:res.tempFilePaths[0]
      })
			wx.showLoading({          
				title: '上传中',        
			})
        		const filePath = res.tempFilePaths[0]                
        		// 上传图片        
        		wx.getFileSystemManager().readFile({          
        			filePath: filePath,          
        			encoding: 'base64',          
        			success: function(res) {            
        				console.log("[读取图片数据success]",res.data);            
	        			that.scanImageInfo(res.data);    // 调用百度API解析图片获取文字      
        			},            
        			fail: function(res){            
        				console.log("[读取图片数据fail]",res)          
        			},            
        			complete: function(res){            
        				wx.hideLoading()          
        			}	
			})
		}    
	})  
},
doTranslate: function(){
  if(!this.data.query) return
  translate(this.data.query,{from:'auto',to: 'zh'}, 1).then(res=>{
    this.setData({'translate_result': res.trans_result})
  })
}
})