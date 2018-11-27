
const app = getApp()
var img = app.globalData.img

Page({
  data:{  
    img:img,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  navigateTo(e) {
    const dataset = e.currentTarget.dataset, url = dataset.url, nav = { url: url };
    wx.navigateTo(nav);
  },
})