// pages/my/service/service.js
Page({
  data:{},
  dianhua:function(){
    wx.makePhoneCall({
      phoneNumber: '0592-2199500' 
    })
  },
  onLoad:function(options){
    
  },
})