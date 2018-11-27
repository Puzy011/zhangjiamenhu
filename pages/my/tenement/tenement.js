// pages/my/approve/approve.js
const app = getApp()
var img = app.globalData.img
var openid = ''
Page({
  data: {
    hasPerson: true,
    userInfo: {},
    img: img,
    Tenants:''
  },

  onLoad: function () {
    var that = this
    wx.getStorage({
      key: 'jsopenid',
      success: function (res) {
        //console.log(res.data)
        var openid = res.data
        wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/member/getTenantList',
          data: {
            openid: openid,
            type: 1
          },
          method: 'GET',
          success: function (res) {
            that.setData({
              Tenants: res.data.data,
            })
            if (res.data.message == '暂无租客') {
              this.setData({
                hasPerson: false,
              });
              wx.showModal({
                showCancel: false,
                content: res.data.message
              })
            }
          }
        })
      }
    })
  },

  //删除租户
  deleteTenants: function (event) {
    //console.log(event.currentTarget.dataset.mid)
    wx.showModal({
      title: '提示',
      content: '你确定要删除么',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/member/chanStatus',
            data: {
              openid: openid,
              mid: event.currentTarget.dataset.mid
            },
            method: 'GET',
            success: function (res) {
              wx.showModal({
                showCancel: false,
                content: '删除成功！'
              })
            }
          })  
        }
      }
    })
  },
})