//index.js
//获取应用实例
var app = getApp()
var openid = ''
var car = []
var price = ''
var Brandmodels = ''
var carnum = ''
var carcolo = ''
var carplace = ''
Page({
  data: {
    price: "30",  //20
    state: "",
    carBrand: "",
    carColor: "",
    carNumber: "",
    time: "12:00",
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //品牌车型
  carBrand: function (e) {
    Brandmodels = e.detail.value;
    this.setData({ carBrand: Brandmodels })
  },
  //车牌号
  carNumber: function (e) {
    carnum = e.detail.value;
    //新能源  
    // var number = new RegExp('([\u4e00-\u9fa5][a-zA-Z](([DF](?![a-zA-Z0-9]*[IO])[0-9]{4})|([0-9]{5}[DF])))|([冀豫云辽黑湘皖鲁苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼渝京津沪新京军空海北沈兰济南广成使领A-Z]{1}[a-zA-Z0-9]{5}[a-zA-Z0-9挂学警港澳]{1})');
    //车牌号判断 
    var number = new RegExp('[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}');
    var res = number.exec(carnum);
    if (res == null) {
      //弹窗
      wx.showModal({
        title: '提示',
        content: '您输入的车牌号不正确，请重新输入',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }
    this.setData({ carNumber: carnum })
  },
  //车颜色
  carColor: function (e) {
    carcolo = e.detail.value;
    this.setData({ carColor: carcolo })
  },
  //停靠位置
  carPlace: function (e) {
    carplace = e.detail.value;
    this.setData({ carPlace: carplace })
  },
  //显示价格
  /*showPrice:function(){
    if(this.data.state=="month"){
        this.setData({price:"18",color1: "green"});
    }
  },*/
  //包月单词选择
  radioChange: function (e) {
    var value = e.detail.value;
    this.setData({ state: value });
    this.showPrice();
  },
  radioChanges: function (e) {
    wx.navigateTo({
      url: '/pages/server/carWash/carWash'
    })
  },
  judge: function () {
    var that = this
    car = []
    car = car.concat('品牌车型：', this.data.carBrand, '车牌号：', this.data.carNumber, '车的颜色：', this.data.carColor, '停靠位置：', this.data.carPlace)
    console.log('洗车', car)
    price = this.data.price
    // console.log(price)
    wx.getStorage({
      key: 'jsopenid',
      success: function (res) {
        // success
        if (res.data.code != 200) {
          openid = res.data
          console.log(openid)
          if (Brandmodels == '') {
            wx.showModal({
              showCancel: false,
              content: '请填写品牌车型号！'
            })
          } else if (carnum == '') {
            wx.showModal({
              showCancel: false,
              content: '请填写车牌号！'
            })
          } else if (carcolo == '') {
            wx.showModal({
              showCancel: false,
              content: '请填写车的颜色！'
            })
          } else if (carplace == '') {
            wx.showModal({
              showCancel: false,
              content: '请填写停靠位置！'
            })
          }
          else {

            wx.request({
              url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/serviceOrder/add',
              data: {
                openid: openid,
                describe: car,
                price: price,
                type: 8
              },
              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
              // header: {}, // 设置请求的 header
              success: function (res) {
                // success
                console.log('resssss:', res)
                if (res.data.code != 200) {
                  wx.showModal({
                    showCancel: false,
                    content: res.data.message
                  })
                } else if (price == '') {
                  wx.showModal({
                    showCancel: false,
                    content: '请选择夜间上门洗车！'
                  })
                } else if (Brandmodels == '') {
                  wx.showModal({
                    showCancel: false,
                    content: '请填写品牌车型号！'
                  })
                } else if (carnum == '') {
                  wx.showModal({
                    showCancel: false,
                    content: '请填写车牌号！'
                  })
                } else if (carcolo == '') {
                  wx.showModal({
                    showCancel: false,
                    content: '请填写车的颜色！'
                  })
                }
                else if (carplace == '') {
                  wx.showModal({
                    showCancel: false,
                    content: '请填写停靠位置！'
                  })
                }

                else {
                  var sign = ""
                  var MD5Util = require('../../../../utils/md5.js');
                  var timeStamp = (Date.parse(new Date()) / 1000).toString();
                  console.log('res:', timeStamp)
                  //var timeStamp = res.data.data.timeStamp;
                  var appid = res.data.data.appId
                  console.log('appid:', appid)
                  var nonceStr = res.data.data.nonceStr
                  var pkg = res.data.data.package
                  var key = res.data.data.key
                  var oid = res.data.message
                  console.log('oid:', oid)

                  var signA = "appId=" + appid + "&nonceStr=" + nonceStr + "&package=" + pkg + "&signType=MD5&timeStamp=" + timeStamp;
                  var signB = signA + "&key=" + key;
                  sign = MD5Util.MD5(signB).toUpperCase();
                  console.log('SIGNB:', sign)
                  wx.showModal({
                    title: '注意',
                    content: '付款之后订单将不能取消',
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定', res)
                        wx.requestPayment({
                          timeStamp: timeStamp,
                          nonceStr: nonceStr,
                          package: pkg,
                          signType: 'MD5',
                          paySign: sign,
                          success: function (res) {
                            // success
                            console.log('success')
                            wx.request({
                              url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Maintenance/postServiceInfo',
                              //oid：订单编号 aprice：实付金额 status：付款状态（0未 1已） 
                              data: {
                                openid: openid,
                                oid: oid,
                                sid:8
                              },
                              method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                              success: function (res) {
                                // success
                                console.log("信息", res)
                                console.log("data:", res.data)
                                if (res.data.errcode != 0) {
                                  wx.showModal({
                                    title: '支付成功',
                                    showCancel: false,
                                    content: '洗车服务预约成功，请到消息中心-掌家服务内查看',
                                    success: function (res) {
                                      if (res.confirm) {
                                        wx.navigateBack({
                                          delta: 1
                                        })
                                        console.log('成功')
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
                            
                            // wx.navigateBack({
                            //   delta: 1
                            // })
                            
                          }
                        })

                      } else { }
                    }
                  })
                }
              }
            })
          }
        }
      }
    })

  },
  onLoad: function (options) {
    var that = this
    Brandmodels = ''
    carnum = ''
    carcolo = ''
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
            console.log("res:", res)
            /*if(res.data.code!=200){
              wx.showModal({
                content:'请先进行业主认证并联系物业',
                success: function(res) {
                  wx.navigateBack({
                    delta: 1           
                  })
                }
              })
            } */
          }
        })
      }
    })
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value
    })
  }
})