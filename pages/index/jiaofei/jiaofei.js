//index.js
//获取应用实例
var util = require('../../../utils/util.js')
var formatLocation = util.formatLocation
function initSubMenuDisplay() {
  return ['hidden', 'hidden', 'hidden'];
}
function initSubMenuDisplays() {
  return ['hidden', 'hidden', 'hidden'];
}
const app = getApp()
var img = app.globalData.img
var i = 0
var titles = []
var textares = []
var title = []
var item = []
var content = []
var upic = ''
var idg = ''
var author = ''
var time = ''
var openid = ''
var upsum = 0
var downsum = 0
var type = 1
var nickname = ''
var pic = ''
var money = ''
Page({
  data: {
    img: img,
    textspan: '',
    winWidth: 0,
    winHeight: 0,
    current: 0,
    hidden: false,
    userInfo: {},
    subMenuDisplays: initSubMenuDisplays(),
    subMenuDisplay: initSubMenuDisplay(),
    selectedMenuId: 1,
    toshow: 'none',
    curIndex: 0,
    count: 0,
    counts: 0,
    hasLocation: false
  },

  tapMainMenu: function (e) {//        获取当前显示的一级菜单标识
    var index = parseInt(e.currentTarget.dataset.index);        // 生成数组，全为hidden的，只对当前的进行显示
    var newSubMenuDisplay = initSubMenuDisplay();//        如果目前是显示则隐藏，反之亦反之。同时要隐藏其他的菜单
    if (this.data.subMenuDisplay[index] == 'hidden') {
      newSubMenuDisplay[index] = 'show';
    } else {
      newSubMenuDisplay[index] = 'hidden';
    }        // 设置为新的数组
    this.setData({
      subMenuDisplay: newSubMenuDisplay
    });
  },
  tapMainMenus: function (e) {//        获取当前显示的一级菜单标识
    var indexs = parseInt(e.currentTarget.dataset.index);        // 生成数组，全为hidden的，只对当前的进行显示
    var newSubMenuDisplays = initSubMenuDisplays();//        如果目前是显示则隐藏，反之亦反之。同时要隐藏其他的菜单
    if (this.data.subMenuDisplays[indexs] == 'hidden') {
      newSubMenuDisplays[indexs] = 'show';
    } else {
      newSubMenuDisplays[indexs] = 'hidden';
    }        // 设置为新的数组
    this.setData({
      subMenuDisplays: newSubMenuDisplays
    });
  },
  picTo: function (e) {
    var price = e.detail.value
    console.log('price:', price)
  },
  formSubmit: function (e) {
    var that = this
    wx.request({
      url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Payment/index',
      data: {
        openid: openid,
        money: money
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log('openid', res)
        console.log('oid返回:', res.data.data.oid)
        var oid = res.data.data.oid
        // success
        if (res.data.code != 200) {
          wx.showModal({
            content: res.data.message
          })
        } else {
          var sign = ""
          var MD5Util = require('../../../utils/md5.js');
          var timeStamp = (Date.parse(new Date()) / 1000).toString();
          console.log('res:', timeStamp)
          //var timeStamp = res.data.data.timeStamp;
          var appid = res.data.data.appId
          console.log('appid:', appid)
          var nonceStr = res.data.data.nonceStr
          var pkg = res.data.data.package
          var key = res.data.data.key

          var signA = "appId=" + appid + "&nonceStr=" + nonceStr + "&package=" + pkg + "&signType=MD5&timeStamp=" + timeStamp;
          var signB = signA + "&key=" + key;
          sign = MD5Util.MD5(signB).toUpperCase();
          console.log('SIGNB:', sign)
          wx.requestPayment({
            timeStamp: timeStamp,
            nonceStr: nonceStr,
            package: pkg,
            signType: 'MD5',
            paySign: sign,
            success: function (res) {
              // success
              console.log('success')
              console.log(res)
              wx.request({
                url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/payment/wxCallBack',
                //oid：订单编号 aprice：实付金额 status：付款状态（0未 1已）
                data: {
                  openid: openid,
                  oid: oid,
                  aprice: money,
                  status: 1
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                success: function (res) {
                  // success
                  console.log("信息", res.data)
                  // console.log("status:", res.data.status)
                  if (res.data.code != 200) {
                    wx.showModal({
                      content: '支付成功!',
                      success: function (res) {
                        if (res.confirm) {
                          wx.navigateBack({
                            delta: 2
                          })
                          console.log('成功')
                        } else {
                          wx.navigateBack({
                            delta: 2
                          })
                        }
                      }
                    })
                  }

                }

              })
            }
          })
        }
      }
    })
    that.setData({
      money: money,
    })
  },

  allMoneyTo: function () {
    wx.navigateTo({
      url: '/pages/index/finally/finally'
    })
  },


  onLoad: function (e) {
    var that = this;
    wx.getStorage({
      key: 'upsum',
      success: function (res) {
        upsum = res.data
        console.log(upsum)
        that.setData({
          count: upsum
        })
      }
    })
    wx.getStorage({
      key: 'jsopenid',
      success: function (res) {
        // success
        openid = res.data
        wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/article/getMemberInfo',
          data: {
            openid: openid
          },
          method: 'GET',
          success: function (res) {
            console.log("业主res:", res.data.data[0])
            if (res.data.code == 200) {
              that.setData({
                hasLocation: true,
                locationAddress: res.data.data[0].residential_name
              })
            }
          }
        })
        // 获取首页显示
        wx.getUserInfo({
          success: function (res) {
            //console.log('昵称001',res.userInfo.nickName)
            //console.log('图片001',res.userInfo.avatarUrl)
            var nickname = res.userInfo.nickName
            var pic = res.userInfo.avatarUrl
            wx.request({
              url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/article/index',
              data: {
                openid: openid,
                nickname: nickname, //昵称
                pic: pic//头像
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              success: function (res) {
                // success
                console.log('金：', res.data.data[0].money)
                money = res.data.data[0].money
                titles = titles.concat(res.data.data[0].title)
                textares = textares.concat(res.data.data[0].content)
                idg = idg.concat(res.data.data[0].id)
                upic = upic.concat(res.data.data[0].upic)
                console.log('upic', upic)
                author = author.concat(res.data.data[0].author)
                time = time.concat(res.data.data[0].time)
                if (res.data.data[0].vote == 1) {
                  var show = ""
                  var usum = res.data.data[0].up
                  var dsum = res.data.data[0].down
                  if (usum == null) usum = 0
                  if (dsum == null) dsum = 0
                } else {
                  var show = "none"
                }
                //console.log('值：',time)
                wx.setStorage({
                  key: 'gonggaoid',
                  data: idg,
                })
                that.setData({
                  titles: titles,
                  textares: textares,
                  id: idg,
                  author: author,
                  money: money,
                  time: time,
                  upic: upic,
                  toshow: show,
                  count: usum,
                  counts: dsum
                })
              }
            })
          }
        })
        //获取资讯显示
        //console.log('openidring',res.data)
        wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Neighborhood/getNeighborhoodList',
          data: {
            openid: openid,
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function (res) {
            console.log('3333', res)
            item = res.data.data
            console.log('4444', item)
            that.setData({
              items: item
            });

            if (res.data.code != 200) {
              wx.showModal({
                content: res.data.message
              })
            }



          }
        })
        //dconsole.log('type',type)

      }
    })
    //获取设备宽高
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      //console.log('pic',userInfo.avatarUrl)
      //console.log('nickname',userInfo.nickName)
      pic = userInfo.avatarUrl,
        nickname = userInfo.nickName,
        that.setData({
          userInfo: userInfo
        })
    })
  },
  onShow: function (e) {
    var that = this
    wx.request({
      url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Neighborhood/getNeighborhoodList',
      data: {
        openid: openid,
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        console.log('5555555', res)
        item = res.data.data
        console.log('444', item)
        that.setData({
          items: item
        });

      }
    })
    
  }
})



