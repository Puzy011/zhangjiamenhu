// pages/index/detail/detail.js
const app = getApp()
var img = app.globalData.img
var idg = ''
var id = ''
var openid = ''
var title = ''
var pic = ''
var content = ''
var time = ''
var username = ''
var i = 0
Page({
  data: {
    img: img,
    title: '',
    content: '',
    time: '',
  },
  onLoad: function (e) {
    //console.log(JSON.parse(e.detail))
    var notice = JSON.parse(e.detail)
    this.setData({
      title: notice.title,
      time: notice.time,
      content: notice.content
    })
  }
})