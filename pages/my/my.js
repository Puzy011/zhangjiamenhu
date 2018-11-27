const app = getApp()
var img = app.globalData.img
var openid = ''
var head_show = ""
var type = ''
Page({
  data: {
    img: img,
    userInfo: {},
    auth: 1,
    type:'',
  },

  onLoad: function () {
    this.setData({
      auth: app.globalData.auth,
      type: app.globalData.membertype,
      userInfo: app.globalData.userInfo
    })
    if (this.data.type == 2 && this.data.auth == 2) { 
      type = 2
      this.setData({ head_show: '家人' }) 
    } else if (this.data.type == 1 && this.data.auth == 2) { 
      type = 1
      this.setData({ head_show: '租户' }) 
    } else if (this.data.type == 0 && this.data.auth == 2) { 
        type = 0
        this.setData({ 
          head_show: '业主', 
          Tenants: app.globalData.membertype1, 
          family: app.globalData.membertype2 
        }) 
    } else if (this.data.auth == 1 || this.data.auth == null || this.data.auth == '')
    { type = 3, this.setData({ head_show: '未认证' }) }
    else {
      this.setData({ head_show: '未认证' })
    }
  },

  navigateTo(e) {
    const dataset = e.currentTarget.dataset, url = dataset.url, nav = { url: url};
    wx.navigateTo(nav);
  },

  message: function () {
    if (app.globalData.isVerified == 0) {
      wx.showModal({
        title: '未认证',
        content: '请到我的>资料填写进行认证',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../my/mycom/mycom',
            });
            //console.log('用户点击确定')
          }
        }
      })
    } else if (app.globalData.isVerified == 1) {
      wx.showModal({
        title: '您已提交',
        content: '请耐心等候物业进行认证',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({

            })
            //console.log('用户点击确定')
          }
        }
      })
    } else {
      if (app.globalData.auth == 2) {
        wx.navigateTo({
          url: 'message/message'
        })
      } else {
        wx.showModal({
          title: '未认证',
          content: '请到我的>资料填写进行认证',
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '../my/mycom/mycom',
              });
              //console.log('用户点击确定')
            }
          }
        })
      }
    }
  }
})