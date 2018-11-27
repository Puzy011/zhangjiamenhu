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
    img: img,
    userInfo: {},
    wuye: [
      {
        id: 0,
        name: "文园雅阁",
        name1: "物业管理处",
        phone: "0592-2511170",
        img: '../../image/qq.jpg'
      }, {
        id: 1,
        name: "文园雅阁专属管家",
        name1: "姓名：谢勇龙",
        phone: "18906048275",
        img:"../../image/zhuren.jpg" 
      }
    ],
    content: [
      {
        id: 1,
        name: "管理处：谢主任",
        // phone: "13306007818",
      }, {
        id: 2,
        name: "领班：管树溪",
        // phone: "18965808520",
      }, {
        id: 3,
        name: "管理员：车全艳",
        // phone: "18060991385",
      }, {
        id: 4,
        name: "水电工程：陈建飞",
        // phone: "13159205597",
      }
    ]
  },

  onLoad: function () {
    var that = this;
    app.getUserInfo(function (userInfo) {
      //console.log(userInfo)
      pic = userInfo.avatarUrl,
        nickname = userInfo.nickName,
        that.setData({
          userInfo: userInfo
        })
    })
  },

  //拨打电话
  callTo: function (e) {
    //console.log(e)
    const call = e.currentTarget.dataset.index;
    wx.makePhoneCall({
      phoneNumber: call
      // phoneNumber: '0592-2199500'
    })
  },

  /*detailTo: function (e) {
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
      // url: '/pages/index/detail/detail?id={{item.id}}'
      url: '/pages/index/detail/detail?id=' + index
    })
  }*/
})