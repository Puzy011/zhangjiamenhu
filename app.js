//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    console.log('App.Launch')
    //console.log("Path: " + options.scene)
    wx.getSystemInfo({
      success: function (res) {
        //console.log(res)
        var version = res.SDKVersion;
        console.log('基础库版本：' + version)
      }
    })
	},

  onError: function () {
    //错误提示
    console.log('App Error')
  },

  globalData: {
    auth: '',//1未通过2通过
    membertype: '',//2家人1租户0业主
    membertype1: '',
    membertype2: '',
    openid: '',
    userInfo: null,
    position: [],
    data: {},
    isVerified: null,
    img: "http://img.zhangjiamenhu.com/",
  },

  getUserInfo: function (callback) {
    var that = this
    if (this.globalData.userInfo) {
      callback(this.globalData.userInfo)
    } else {
      wx.login({
        //调用登录接口
        success: function (res) {
          //console.log(res)
          wx.getUserInfo({
            success: function (res) {
              //console.log(res)
              that.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              callback(that.globalData.userInfo)
            }
          })
          if (res.code) {
            wx.request({
              url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/openid/getopenid',
              data: {
                code: res.code
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              // header: {}, // 设置请求的 header
              success: function (res) {
                //console.log(res)
                that.globalData.openid = res.data.data.openid
                wx.setStorage({
                  //将openid存入本地缓存中
                  key: 'jsopenid',
                  data: res.data.data.openid,
                })
              }
            })
          }
        }
      })
      //用户地理位置
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userLocation']) {
            wx.authorize({
              scope: 'scope.userLocation',
              success() {
                // 用户已经同意小程序使用地理位置，后续调用wx.getLocation接口不会弹窗询问
                wx.getLocation({
                  type: 'wgs84',
                  success: function (res) {
                    that.globalData.position.latitude = res.latitude
                    that.globalData.position.longitude = res.longitude
                    that.globalData.position.speed = res.speed
                    that.globalData.position.accuracy = res.accuracy
                  }
                })
              }
            })
          } else {
            wx.getLocation({
              type: 'wgs84',
              success: function (res) {
                that.globalData.position.latitude = res.latitude
                that.globalData.position.longitude = res.longitude
                that.globalData.position.speed = res.speed
                that.globalData.position.accuracy = res.accuracy
              }
            })
          }
        }
      })
    }
  },

  getNotice: function (callback) {
    var that = this
    wx.getStorage({
      key: 'jsopenid',
      success: function (res) {
        //console.log(res)
        var openid = res.data
        wx.request({
          //获取资讯列表
          // url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/article/listsWithFour',
          url:'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Article/info/id/102',
          data: {
            openid: openid
          },
          method: 'GET',
          success: function (res) {
            console.log(res)
            that.globalData.data = res.data
            callback(that.globalData.data)
          }
        })
      }
    })
  },

  getVerified: function (callback) {
    var that = this
    wx.getStorage({
      key: 'jsopenid',
      success: function (res) {
        //console.log(res)
        var openid = res.data
        wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/member/validateUserStatus',
          data: {
            openid: openid,
          },
          method: 'GET',
          success: function (res) {
            //console.log(res)
            //console.log('0，新用户; 1，未认证; 2，认证通过', res.data.data)
            that.globalData.isVerified = res.data.data
            callback(that.globalData.isVerified)
          }
        })

      }
    })
  },


})
