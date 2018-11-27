// pages/my-com/mycom.js
const app = getApp()
var img = app.globalData.img
var openid = ''
Page({
  data: {
    img: img,
    id: '',
    list:[],
    code:'',
    content1: [
      {
        id: 4,
        image: img + 'chenjian.jpg',
        name: "晨间厨房",
        phone: "【首单满12-5/满22减10】",
      },
      {
        id: 3,
        image: img + '1yuan.png',
        name: "早餐活动",
        phone: "【1元早餐/只要1元】",
      },
      {
        id: 1,
        image: img + 'du-LOGO.jpg',
        name: "肚子里有料",
        phone: "【首单满12-5/满22减10】",
      }, {
        id: 2,
        image: img + 'wu-logo.jpg',
        name: "五润中式早餐连锁",
        phone: "【首单满12-5/满22减10】",
      }
    ],
    content2: [
      {
        id: 4,
        image: img + 'chenjian.jpg',
        name: "晨间厨房",
        phone: "【首单满12-5/满22减10】",
      },
      {
        id: 1,
        image: img + 'du-LOGO.jpg',
        name: "肚子里有料",
        phone: "【首单满12-5/满22减10】",
      },
      {
        id: 2,
        image: img + 'wu-logo.jpg',
        name: "五润中式早餐连锁",
        phone: "【首单满12-5/满22减10】",
      }
    ]
  },

  onShow: function () {
    var that = this;
    if (app.globalData.openid) {
      wx.request({
        url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/ServiceOrder/isFirstBuying',
        data: {
          openid: app.globalData.openid,
          type: 3
        },
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        // header: {}, // 设置请求的 header
        success: function (res) {
          //console.log(res)
          var code = res.data.code
          that.setData({
            code: code
          })
          if (code == 400) {
            that.setData({
              list: that.data.content1
            })
          } else if (code == 200) {
            that.setData({
              list: that.data.content2
            })
          }
        }
      })

    }
  }

})