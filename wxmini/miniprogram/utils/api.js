import md5 from './md5.min.js'

const appid = '20230418001647067'
const key = 'hZzp6A5J5GDOee4P4TYM'

function textTranslate(q, from, to){
  return new Promise((resolve, reject) => {
    let salt = Date.now()
    let sign = md5(`${appid}${q}${salt}${key}`)
    wx.request({
      url: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
      data: {
        q,
        from,
        to,
        appid,
        salt,
        sign
      },
      success(res) {
        if(res.data && res.data.trans_result) {
          // console.log(res,'1')
          // console.log(res.data,'2')
          // console.log(res.data.trans_result,'3')
          resolve(res.data)
        } else{
          reject({status: 'error', msg: '翻译失败'})
          wx.showToast({
            title: '翻译失败',
            icon: 'none',
            duration: 3000
          })
        }
      },
      fail() {
        reject({status: 'error', msg: '翻译失败'})
        wx.showToast({
          title: '网络异常',
          icon: 'none',
          duration: 3000
        })
      }
    })
  })
}

const cuid = 'APICUID'
const mac = 'mac'
const version = 3

function imageTranslate(q, from, to){
  return new Promise((resolve, reject) => {
    let salt = Date.now()
    let file = wx.getFileSystemManager().readFile({
      filePath: q
    });
    let sign = md5(`${appid}${md5(file)}${salt}${cuid}${mac}${key}`)
   wx.uploadFile({
     filePath: q,
     name: 'image',
     url: 'https://fanyi-api.baidu.com/api/trans/sdk/picture',
     formData:{
       from: from,
       to: to,
       appid: appid,
       salt: salt,
       cuid: cuid,
       mac: mac,
       version: version,
       sign: sign,
       contentType: 'multipart/form-data',
       dataType: 'json',
     },
     success(res) {
      if(res.data && res.data.sumSrc) {
        // console.log(res,'1')
        // console.log(res.data,'2')
        // console.log(res.data.trans_result,'3')
        resolve(res.data)
      } else{
        console.log(res.data)
        reject({status: 'error', msg: '翻译失败'})
        wx.showToast({
          title: '翻译失败',
          icon: 'none',
          duration: 3000
        })
      }
    },
    fail() {
      reject({status: 'error', msg: '翻译失败'})
      wx.showToast({
        title: '网络异常',
        icon: 'none',
        duration: 3000
      })
    }
   })
  })
}

function translate(q, { from = 'auto', to = 'auto' } = { from: 'auto', to: 'auto'}, type) {
  switch (type)
  {
    case 1:
      return textTranslate(q, from, to);
      break;
    case 2:
      return imageTranslate(q, from, to);
      break;
    case 3:
      return voiceTranslate(q, from, to);
      break;
  }
}
module.exports.translate = translate