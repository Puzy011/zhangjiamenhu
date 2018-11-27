//index.js
//获取应用实例
const app = getApp()
var img = app.globalData.img
Page({
  data: {
    img:img,
    motto: 'Hello World',
    price:'48',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../ident/ident'
    })
  },
  //生二维码
  bindViewOpen: function () {
    wx.navigateTo({
      url: '../ident/ident'
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
    //计时器3S
    setTimeout(function () {
      var count;
      // count = count--;
      if (count > 0) {
        count--;
      } else {
        wx.navigateTo({
          url: 'code/code',
        })
      }
    }, 3000);
  }
  
})
