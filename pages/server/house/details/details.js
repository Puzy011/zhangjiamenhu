// page/component/details/details.js
const app = getApp()
var img = app.globalData.img 
var util = require('../../../../utils/util.js');
var goods = []
var goods_photo = ''
var id = ''
var g_id = ''
var name = ''
var sell_price = ''
var goods_photo = ''
var store_nums = ''
var weight = ''
var content = []
var banner = []
var g_photo = []
var openid = ''
var pid = ''
var ppid = ''
var eeid = ''
var code_id = ''

Page({
  data: {
    img: img,
    show_comment:1,
    pid: '',
    clock: '',
    time: '',
    total_micro_second: '',
    goods: {
      img: img,
      id: 1,
      // image: img + 'q-2.png',
      title: '18K金祖母绿戒托',
      price: 10800,
      stock: '有货',
      detail: '18K金祖母绿戒托这里是梨花带雨详情。',
      parameter: '10800/个',
      service: '18K金祖母绿戒托不支持退货'
    },
    house: {},
    name: '',
    count: '',
    now_price: '',
    orginal_price: '',
    image: [
      {
        id: 1,
        pic: img + 'housekeep3.png'
      }, {
        id: 2,
        pic: img + 'housekeep2.png'
      }, {
        id: 3,
        pic: img + 'housekeep1.png'
      }
    ],
    list1: [
      {
        id: 1,
        pic: img + 'housekeeplist2.jpg'
      // },{
      //   id: 2,
      //   pic: img + 'k2.jpg'
      // }, {
      //   id: 3,
      //   pic: img + 'k3.jpg'
      // }, {
      //   id: 4,
      //   pic: img + 'k4.jpg'
      // }, {
      //   id: 5,
      //   pic: img + 'k5.jpg'
      // }, {
      //   id: 6,
      //   pic: img + 'k6.jpg'
      // }, {
      //   id: 7,
      //   pic: img + 'k7.jpg'
      // }, {
      //   id: 8,
      //   pic: img + 'k8.jpg'
      // }, {
      //   id: 9,
      //   pic: img + 'k9.jpg'
      }
    ],
    list2: [
      {
        id: 1,
        pic: img + 'k10.jpg'
      }, {
        id: 2,
        pic: img + 'k11.jpg'
      }, {
        id: 3,
        pic: img + 'k12.jpg'
      }
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false
  },

  /*生命周期函数--监听页面加载*/
  onLoad: function (e) {
    //console.log(e.id);
    var that = this
    wx.getStorage({
      key: 'jsopenid',
      success: function (res) {
        openid = res.data
        wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/payment/getHomeServiceList',
          data: {
          },
          method: 'GET',
          success: function (res) {
            console.log("家政返回:", res.data)
            that.setData({
              count: res.data.data[0].count,
              name: res.data.data[0].name,
              now_price: res.data.data[0].now_price,
              orginal_price: res.data.data[0].orginal_price
            })
            count_down(that);
          }
        })
        wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/ServiceOrder/isFirstBuying',
          data: {
            openid: openid,
            type: 5
          },
          method: 'GET',
          success: function (res) {
            //console.log('3333', res)
            var code = res.data.code
            //console.log('code：', code)
            that.setData({
              code: code
            })
            if (code == 400) {
              that.setData({
                show_comment: 1
              })
            } else if (code == 200) {
              that.setData({
                show_comment: 0
              })
            }
          }
        })
      }
    })
  },

  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },

  //已经买过的
  paynobindTap: function () {
    wx.showModal({
      title: '不可购买',
      showCancel: false,
      content: '您已经购买过此活动服务，不可重复购买'
    })
  },
  //結算
  paybindTap(e) {
    var that = this
    if (this.data.clock == "已经截止") {
      wx.showModal({
        title: '不可购买',
        showCancel: false,
        content: '本产品已过期'
      })
      return
    }
    var price = e.currentTarget.dataset.price
    wx.getStorage({
      key: 'jsopenid',
      success: function (res) {
        openid = res.data
        wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/serviceOrder/add',
          data: {
            openid: openid,
            describe: '家政团购',
            price: price,
            type: 5
          },
          method: 'GET',
          success: function (res) {
            //console.log(res)
            if (res.data.code != 200) {
              wx.showModal({
                content: '唤起支付失败',
                showCancel: false,
              })
            } else {
              var sign = ""
              var MD5Util = require('../../../../utils/md5.js');
              var timeStamp = (Date.parse(new Date()) / 1000).toString();
              var appid = res.data.data.appId
              var nonceStr = res.data.data.nonceStr
              var pkg = res.data.data.package
              var key = res.data.data.key
              var oid = res.data.message
              var signA = "appId=" + appid + "&nonceStr=" + nonceStr + "&package=" + pkg + "&signType=MD5&timeStamp=" + timeStamp;
              var signB = signA + "&key=" + key;
              sign = MD5Util.MD5(signB).toUpperCase();
              console.log('SIGNB:', sign)
              wx.showModal({
                title: '注意',
                content: '付款之后订单将不能取消',
                success: function (res) {
                  if (res.confirm) {
                    wx.requestPayment({
                      timeStamp: timeStamp,
                      nonceStr: nonceStr,
                      package: pkg,
                      signType: 'MD5',
                      paySign: sign,
                      success: function (res) {
                        //console.log(res)
                        wx.request({
                          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Maintenance/postServiceInfo', 
                          data: {
                            openid: openid,
                            oid: oid,
                            sid: 5
                          },
                          method: 'GET',
                          success: function (res) {
                            //console.log("信息", res)
                            if (res.data.errcode != 0) {
                              wx.showModal({
                                title: '支付成功',
                                showCancel: false,
                                content: '家政团购服务预约成功，请到消息中心-掌家服务内查看',
                                success: function (res) {
                                  if (res.confirm) {
                                    wx.navigateBack({
                                      delta: 1
                                    })
                                  } else {
                                    wx.navigateBack({
                                      delta: 1
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
            }
          }
        })
      }
    })
  },
  /*
  //减
  minusCount() {
    let num = this.data.num;
    num--;
    //负数问题不能小于0,已经解决
    this.setData({
      num: num < 0 ? 0 : num
    })
  },
  //加
  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num: num
    })
  },
  //加到购物车
  addToCart() {
    const self = this;
    const num = this.data.num;
    let total = this.data.totalNum;

    self.setData({
      show: true
    })
    setTimeout(function () {
      self.setData({
        show: false,
        scaleCart: true
      })
      setTimeout(function () {
        self.setData({
          scaleCart: false,
          hasCarts: true,
          totalNum: num + total
        })
      }, 200)
    }, 300)

  },*/

  //分享功能

  onShareAppMessage: function () {
    return {
      title: '你的好友正在团购',
      path: "/pages/server/house/details/details",
      success: function (res) {
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 分享失败
        wx.showModal({
          title: '分享失败'
        })
      }
    }
  },

})

/** 
  需要一个目标日期，初始化时，先得出到当前时间还有剩余多少秒
  1.将秒数换成格式化输出为XX天XX小时XX分钟XX秒 XX
  2.提供一个时钟，每10ms运行一次，渲染时钟，再总ms数自减10
  3.剩余的秒次为零时，return，给出tips提示说，已经截止
*/
function count_down(that) {
  var timestamp = Date.parse(new Date());//当前时间戳
  var stringTime = "2018/3/05 00:00:00"
  var timestamp2 = Date.parse(new Date(stringTime));
  timestamp = Math.floor(timestamp / 1000);
  timestamp2 = Math.floor(timestamp2 / 1000);
  var total = Math.floor(timestamp2 - timestamp)
  var total_micro_second = total * 1000
  // 渲染倒计时时钟
  that.setData({
    clock: date_format(total_micro_second),
  });

  if (total_micro_second <= 0) {
    that.setData({
      clock: "已经截止"
    });
    return;
  }
  setTimeout(function () {
    count_down(that);
  }, 100)
}
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 天数位
  var dy = Math.floor(hr / 24);
  // 多余小时位
  var hhr = Math.floor(hr - dy * 24);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));
  return dy + "天" + hhr + ":" + min + ":" + sec;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}