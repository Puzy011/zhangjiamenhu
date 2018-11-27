//index.js
//获取应用实例
const app = getApp()
var img = app.globalData.img
var openid = ''
var touchDotX = ''
var touchDotY = ''
var time=''
Page({
  data: {
    touch_start:'',
    touch_end:'',
    animate:'animate',
    animationData: {},
    img: img,
    kaisuotp: img + "off.png",
    kaisuobtn: img + "clock.png",
    kaisuobtn1: img + "clock.png",
    kaisuobtn2: img + "clock2.png",
    kaisuobtn3: img + "clock3.png",
    state: "一键开门",
    color: 'txt',
    userInfo: {},
    ObtainQR_code: "门未打开？点击这里获取二维码",
    ewm: true,
    second: 10,
    timer: '',
    hideclock: true,
    flag: false,
    opening:false,
    othergate: false
  },

  //分享功能
  onShareAppMessage: function () {
    return {
      title: '分享',
      path: "pages/kaisuo/kaisuo",
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showModal({
          title: '分享失败'
        })
      }
    }
  },

  onLoad: function () {
    //console.log('onLoad开锁')
    var that = this
    wx.getStorage({
      key: 'jsopenid',
      success: function (res) {
        openid = res.data
        wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/article/getMemberInfo',
          data: {
            openid: openid
          },
          method: 'GET',
          success: function (res) {
            //console.log("res:", res)
            if (res.data.code == 200) {
              var auth = res.data.data[0].authentication
              that.setData({
                display: res.data.data[0].authentication,
              });
              if (auth != 2) {
                var isVerify=app.globalData.isVerified
                if (isVerify == 0) {
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
                } else if (isVerify == 1) {
                  wx.showModal({
                    title: '您已提交',
                    content: '请耐心等候物业进行认证',
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        //console.log('用户点击确定')
                      }
                    }
                  })
                }
              }
            }
          }
        })
      }
    })
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    })
  },

  //认证后刷新
  pressrefresh:function (){
    this.onLoad()
  },
  
  //点击获取二维码
  saomakaisuo: function () {
    var that = this
    wx.getStorage({
      key: 'jsopenid',
      success: function (res) {
        openid = res.data
        wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Device/addOwnerQrCode', //二维码图片地址
          data: {
            openid: openid
          },
          method: 'GET',
          success: function (res) {
            //console.log(res)
            if (res.statusCode == 200) {
              that.setData({
                erweima: res.data,
                second: 10,
                ewm: false,
                hideclock: false,
              })
              countdown(that);
            }
          },
        })
      }
    })
  },
  
  //开锁按钮
  kaisuo: function () {
    if(!this.data.opening){
      var animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out',
      })
      animation.scale(2, 2).rotate(45).step()
      this.setData({
        animationData: animation.export(),
        opening: true
      })
      var that = this
      wx.getStorage({
        key: 'jsopenid',
        success: function (res) {
          openid = res.data
          wx.request({
            url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Device/remoteOpenDoor',
            data: {
              openid: openid,
            },
            method: 'GET',
            success: function (res) {
              console.log(res)
              if (res.data.statusCode == 1) {
                that.setData({
                  kaisuobtn1: "http://img.zhangjiamenhu.com/clock_yes.png",
                  //kaisuotp: "http://img.zhangjiamenhu.com/on.png",
                  state: '门禁已打开',
                  color: 'green txt',
                  animate: 'animate_open'
                })
                wx.showToast({
                  title: '门禁已打开',
                  icon: 'success',
                  duration: 2000
                })
                that.returnstate();
              } else {
                that.setData({
                  kaisuobtn1: "http://img.zhangjiamenhu.com/clock_no.png",
                  color: 'red txt',
                  state: res.data.responseResult,
                  animate: 'animate_error'
                })
                wx.showModal({
                  showCancel: false,
                  title: '设备错误',
                  content: res.data.responseResult
                })
                that.returnstate();
              }
            }
          })
        }
      })
    }else{
      return;
    }
  },
  returnstate: function () {
    var that = this;
    setTimeout(function () {
      var animation = wx.createAnimation({
        duration: 100,
        timingFunction: 'ease-out',
      })
      animation.scale(1, 1).rotate(45).step()
      that.setData({
        animationData: animation.export()
      })
      that.setData({
        kaisuobtn1: img + "clock.png",
        state: "一键开门",
        color: 'txt',
        animate: 'animate',
        opening:false
      })
    }, 3000)//3s
  },

  /*a: function () {
    this.setData({ flag: false })
  },
  b: function () {
    this.setData({ flag: true })
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
*/

othergate: function(){
  if(!this.data.othergate){
    this.setData({
      othergate:true,
      hideclock:false
    })
  } else {
    this.setData({
      othergate: false,
      hideclock:true
    })
  }
}
  
})
////验证码 计时器
function countdown(that) {
  var second = that.data.second;
  if (second === 0) {
    that.setData({
      second: 10,
      erweima: '',
      ewm: true,
      hideclock: true,
    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }, 1000)
}

