//获取应用实例
const app = getApp()
var img = app.globalData.img
Page({
  data: {
    img:img,
    isAgree:false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../open/open'
    })
  },
  bindAgreeChange: function () {
    if (isAgree==='false'){
      isAgree= true
    }else{
      isAgree = false
    }
  },
  //扫码，扫一扫
  saoma: function () {
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        console.log(res)
      }
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  }
})
