// pages/index/gonggao/gonggao.js
var util = require('../../../utils/util.js')
const app = getApp()
var img = app.globalData.img
var idg = ''
var openid = ''
var title = ''
var pic = ''
var content = []
var time = ''
var username = ''
var nickname = ''

Page({
	data: {
    content: [],
    img: img,
    detail: ''
  },
  onLoad: function (e) {
    // 页面初始化 options为页面跳转所带来的参数
    //console.log(JSON.parse(e.notice))
    this.setData({
      content: JSON.parse(e.notice)
    })
    /*var that = this;
    //从本地缓存中异步获取指定 key 对应的内容
    wx.getStorage({
      key: 'jsopenid',
      success: function (res) {
        openid = res.data
        //获取首页显示
        wx.getUserInfo({
          success: function (res) {
            var nickname = res.userInfo.nickName
            var pic = res.userInfo.avatarUrl
            wx.request({
              url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/article/index',
              data: {
                openid: openid,
                nickname: nickname, //昵称
                pic: pic//头像
              },
              method: 'GET',
              success: function (res) {
              }
            })
          }
        })
      }
    })
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      pic = userInfo.avatarUrl,
        nickname = userInfo.nickName,
        that.setData({
          userInfo: userInfo
        })
    })*/
  },
  detailTo: function (e) {
    const thisdetail = e.currentTarget.dataset.thisdetail;
    console.log(thisdetail+"000")
    wx.navigateTo({
      url: '/pages/index/gonggao/detail/detail?detail=' + JSON.stringify(thisdetail)
    })
  }
})