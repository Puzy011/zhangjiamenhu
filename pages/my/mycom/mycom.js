// pages/my-com/mycom.js
const app = getApp()
var img = app.globalData.img
var openid = ''
var type = ''
Page({
  data: {
    img: img,
    id: '',
  },

  onLoad: function (e) {

  },

  optionTo: function (e) {
    //console.log(e)
    var id = e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../options/options?id=' + id
    })
  },

})