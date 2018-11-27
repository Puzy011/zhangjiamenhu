// pages/goods/goods.js
const app = getApp()
var img = app.globalData.img
var openid = ''
var describe = []
var sid = ''
var firstTime = false
Page({
  data: {
    img: img,
    goods: [],
    sid: '',
    code: '',
    toView: '',
    hidden: true,
    nocancel: false,
    scrollTop: 100,
    foodCounts: 0,
    totalPrice: 0,// 总价格2
    totalCount: 0, // 总商品数
    carArray: [],
    foodlist: [],
    greybtn: 'not-enough',
    minPrice: 0,//起送價格20
    payDesc: '',
    deliveryPrice: 2,//配送費4
    fold: true,
    selectFoods: [{ price: 20, count: 2 }],
    cartShow: 'none',
    status: 0,
  },

  onLoad: function (e) {
    //console.log(e)
    var that = this
    var sid = e.id
    this.setData({
      sid: e.id
    });
    wx.getStorage({
      key: 'jsopenid',
      success: function (res) {
        openid = res.data
        wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/ServiceOrder/isFirstBuying',
          data: {
            openid: openid,
            type: 3
          },
          method: 'GET', 
          success: function (res) {
            //console.log(res)
            var code = res.data.code
            that.setData({
              code: code
            });
          }
        })
        if (sid == 3) {
          wx.request({
            url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/ServiceOrder/getBreakFast',
            data: {
              openid: openid,
              seller_id: sid,
              isSeller: 'False'
            },
            method: 'GET',
            success: function (res) {
              //console.log('False', res.data)
              var item = JSON.parse(res.data.data)
              //console.log('早餐列表：', item)
              that.setData({
                goods: item
              });
            }
          })
        } else {
          wx.request({
            url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/ServiceOrder/getBreakFast',
            data: {
              openid: openid,
              seller_id: sid,
              isSeller: 'True'
            },
            method: 'GET',
            success: function (res) {
              //console.log('True', res.data)
              var item = JSON.parse(res.data.data)
              console.log('早餐列表：', item)
              that.setData({
                goods: item
              });
            }
          })
        }
      }
    })
    this.setData({
      payDesc: this.payDesc()
    });
  },

  //几元送
  payDesc() {
    if (this.data.totalPrice === 0) {
      this.setData({
        greybtn: 'not-enough',
      });
      return `￥${this.data.minPrice}元起送`;
    } else if (this.data.totalPrice < this.data.minPrice) {
      let diff = this.data.minPrice - this.data.totalPrice;
      return '还差' + diff + '元起送';
    } else {
      //console.log('totalPrice', this.data.totalPrice)
      this.setData({
        greybtn: 'enough',
      });
      return '去支付';//去结算
    }
  },

  tabChange: function (e) {
    //切换商家与商品
    //console.log(e)
    var showtype = e.target.dataset.type;
    this.setData({
      status: showtype,
    });
  },

  selectMenu: function (e) {
    //商品类选择
    //console.log(e)
    var index = e.currentTarget.dataset.itemIndex;
    this.setData({
      toView: 'order' + index.toString()
    })
  },
  
  seesee: function (e) {
    //查看大图
    //console.log(e)
    var foodlist = e.currentTarget.dataset.food
    this.setData({
      hidden: false,
      foodlist: foodlist
    });
  },
  confirm: function (e) {
    this.setData({
      hidden: true
    });
  },

  //添加到购物车
  addCart(e) {
    //console.log(e)
    var index = e.currentTarget.dataset.itemIndex
    var parentIndex = e.currentTarget.dataset.parentindex
    this.data.goods[parentIndex].foods[index].Count++
    var mark = 'a' + index + 'b' + parentIndex
    if (this.data.sid == 3) {
      var num = this.data.goods[parentIndex].foods[index].Count
      //console.log(!!firstTime)
      if (num > 1 || firstTime) {
        wx.showModal({
          showCancel: false,
          content: '亲❤～只能买一件特价套餐~',
        })
        this.data.goods[parentIndex].foods[index].Count--
        return num = 1
      }
      firstTime = true
    }else{
      var num = this.data.goods[parentIndex].foods[index].Count;
    }
    var price = this.data.goods[parentIndex].foods[index].price;
    var name = this.data.goods[parentIndex].foods[index].name;
    var id = this.data.goods[parentIndex].foods[index].id;
    var obj = { id: id, price: price, num: num, mark: mark, name: name, index: index, parentIndex: parentIndex };
    var j=0
    var carArray1 = this.data.carArray
    for (var i = 0; i < carArray1.length; i++) {
      if (carArray1[i].mark==mark){
        carArray1[i].num = num
        j++
      }
    }
    if (j == 0) {
      carArray1.push(obj)
    }
    this.setData({
      carArray: carArray1,
      goods: this.data.goods
    })
    this.calTotalPrice();
    this.setData({
      payDesc: this.payDesc()
    });
  },
  
  //移除商品
  decreaseCart: function (e) {
    if (this.data.sid == 3) {
      firstTime = false
    }
    var index = e.currentTarget.dataset.itemIndex;
    var parentIndex = e.currentTarget.dataset.parentindex;
    this.data.goods[parentIndex].foods[index].Count--
    var num = this.data.goods[parentIndex].foods[index].Count;
    var name = this.data.goods[parentIndex].foods[index].name;
    var id = this.data.goods[parentIndex].foods[index].id;
    var mark = 'a' + index + 'b' + parentIndex
    var price = this.data.goods[parentIndex].foods[index].price;
    var obj = { id: id, price: price, num: num, mark: mark, name: name, index: index, parentIndex: parentIndex };
    var j = 0
    var carArray1 = this.data.carArray
    for (var i = 0; i < carArray1.length; i++) {
      if (carArray1[i].mark == mark) {
        carArray1[i].num = num
        j++
      }
    }
    if (j == 0) {
      carArray1.push(obj)
    }
    carArray1 = carArray1.filter(item => item.num != 0);
    this.setData({
      carArray: carArray1,
      goods: this.data.goods
    })
    this.calTotalPrice()
    if (carArray1.length == 0) {
      this.setData({
        cartShow: 'none',
        totalPrice: 0
      })
    }
    this.setData({
      payDesc: this.payDesc(),
    })
  },
  decreaseShopCart: function (e) {
    this.decreaseCart(e);
  },
  addShopCart: function (e) {
    this.addCart(e);
  },

  //计算总价与总数
  calTotalPrice: function () {
    if (this.data.sid == 3) {
      var carArray = this.data.carArray;
      var totalPrice = 0;//2
      var totalCount = 0;
      for (var i = 0; i < carArray.length; i++) {
        totalPrice += carArray[i].price * carArray[i].num;
        totalCount += carArray[i].num
      }
    }else{
      var carArray = this.data.carArray;
      var totalPrice = 2;//2
      var totalCount = 0;
      for (var i = 0; i < carArray.length; i++) {
        totalPrice += carArray[i].price * carArray[i].num;
        totalCount += carArray[i].num
      }
    }
    if (this.data.code == 400) {
      //没买过
      if (12 <= totalPrice && totalPrice < 22) {
        totalPrice = totalPrice - 5
      } else if (22 <= totalPrice) {
        totalPrice = totalPrice - 10
      }
    }
    this.setData({
      totalPrice: totalPrice,
      totalCount: totalCount
    });
  },
  
  //彈起購物車
  toggleList: function () {
    if (!this.data.totalCount) {
      return;
    }
    this.setData({
      fold: !this.data.fold,
    })
    var fold = this.data.fold
    //console.log(this.data.fold);
    this.cartShow(fold)
  },
  cartShow: function (fold) {
    if (fold == false) {
      this.setData({
        cartShow: 'block',
      })
    } else {
      this.setData({
        cartShow: 'none',
      })
    }
  },

  //結算
  pay() {
    var that = this
    sid = this.data.sid
    if (sid == 3 && this.data.totalPrice > 1) {
      wx.showModal({
        showCancel: false,
        content: '亲❤～只能买一件特价套餐~',
      })
      return;
    } else if (this.data.totalPrice < this.data.minPrice) {
      wx.showModal({
        showCancel: false,
        content: '请加购商品~',
      })
      return;
    }

    var price = this.data.totalPrice
    //var resultType = "success";
    // wx.redirectTo({
    //   url: '../goods/pay/pay?resultType=' + resultType
    // })
    //支付

    var carArray = this.data.carArray
    wx.getStorage({
      key: 'jsopenid',
      success: function (res) {
        openid = res.data
        wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/serviceOrder/addBreakOrder',
          data: {
            openid: openid,
            describe: carArray,
            price: price,
            type: 3,
            sell_id: sid
          },
          method: 'GET',
          success: function (res) {
            //console.log(res)
            if (res.data.code != 200) {
              wx.showModal({
                content: '唤起支付失败'
              })
            } else {
              var sign = ""
              var MD5Util = require('../../../utils/md5.js');
              var timeStamp = (Date.parse(new Date()) / 1000).toString();
              //console.log(timeStamp)
              var appid = res.data.data.appId
              var nonceStr = res.data.data.nonceStr
              var pkg = res.data.data.package
              var key = res.data.data.key
              var oid = res.data.message
              //console.log(oid)
              var signA = "appId=" + appid + "&nonceStr=" + nonceStr + "&package=" + pkg + "&signType=MD5&timeStamp=" + timeStamp;
              var signB = signA + "&key=" + key;
              sign = MD5Util.MD5(signB).toUpperCase();
              //console.log('SIGNB:', sign)
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
                          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Maintenance/postBreakInfo',
                          // url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Maintenance/postLeilongWudi',
                          //oid：订单编号 aprice：实付金额 status：付款状态（0未 1已） 
                          data: {
                            openid: openid,
                            oid: oid,
                            sell_id: sid
                          },
                          method: 'GET',
                          success: function (res) {
                            //console.log("信息", res)
                            //console.log("data:", res.data)
                            if (res.data.errcode != 0) {
                              wx.showModal({
                                title: '支付成功',
                                showCancel: false,
                                content: '早餐购买成功，请到消息中心-掌家服务内查看',
                                success: function (res) {
                                  if (res.confirm) {
                                    wx.navigateBack({
                                      delta: 2
                                    })
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
            }
          }
        })
      }
    })
  },
  
})
