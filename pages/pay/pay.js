//index.js
//获取应用实例
const app = getApp()
var img = app.globalData.img
Page({
  data: {
    img:img,
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      // url: '../ident/ident'
    })
  },
  bindViewOpen:function(){
    wx.navigateTo({
      url: '../payment/code/code'
      // url: '../payment/payment'
    })
  },
  bindViewPay:function(){
    
    wx.scanCode({
      // 只允许从相机扫码
      // onlyFromCamera: true,
      //成功回调,跳转
      success: (res) => {
        console.log(res)
        wx.navigateTo({
          url: '../payment/payment'
        })
      }
    })
    
  },
  //扫码，扫一扫
  saoma: function () {
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
        wx.navigateTo({
          url: '../payment/payment'
        })
      }
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
