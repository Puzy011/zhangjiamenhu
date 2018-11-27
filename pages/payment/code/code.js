//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    distance:true,
    count:10
  },
  //事件处理函数
  bindViewBack: function() {
    // wx.navigateBack({
    //   // url: '../index/index'
    // })
    setTimeout(function () {
      var count;
      // count = count--;
      if (count > 0) {
        
        count--;
      } else {
        wx.navigateBack({
          // url: '../index/index'
        })
      }
    }, 1000);

    //震动
    wx.vibrateLong({

    })
  },
  bindViewOpen: function () {
    // wx.navigateBack({
    //   // url: '../index/index'
    // })
    wx.redirectTo({
      url: '../index/index'
    })
    wx.vibrateLong({

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

    //计时器10S
    setTimeout(function () {
      var count;
      // count = count--;
      if (count > 0) {
        count--;
      } else {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    }, 10000);
  }
})
