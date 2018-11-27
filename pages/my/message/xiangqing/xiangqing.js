// pages/my/message/xiangqing/xiangqing.js
var openid=''
var title=[]
var numbe=[]
var status=[]
var fuwu=[]
var i=0
Page({
  data:{
    fuwu:{}
  },
  onLoad:function(options){
    var that=this
    wx.getStorage({
      key: 'jsopenid',
      success: function(res){
        openid=res.data
        wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/serviceOrder/index',
          data: {
            openid:openid
          },
          method: 'GET',
          success: function(res){
          title=res.data.data
          //console.log('服务data:',title)
          if(res.data.code==200){
            that.setData({
             fuwu:title
            })
            }
          }
        })
      }
    })
  }
})