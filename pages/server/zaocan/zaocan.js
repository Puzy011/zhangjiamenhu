// pages/index/zaocan/zaocan.js
const app = getApp()
var img = app.globalData.img
var shopItemData = require('../zaocans.js');
var openid = ''
var oid =''
var i = 0
var id = ''
var result = ''
var data = []
var total = []
var dish = []
var zcid = []
var name = []
var price = []
var count = []
var dishes= []
var describe = []
var zcid = 0
Page({
  data: {
    cartShow: 'none',
    fold: true,
    img: img,
    carArray: [],
    selectedMenuId: 1,
    curIndex: 0,
    shopItemData: shopItemData,
    dishes: shopItemData.dishes,
    total: {
      count: 0,
      money: 2   //1
    }
  },
  selectNav(event) {
    let data = event.currentTarget.dataset
    console.log(data)
    this.setData({
      curIndex: data.index,
      selectedMenuId: data.id
    })
  },
  //加号商品
  addCount: function (event) {
   var cid = event.currentTarget.dataset.cid
   var id = event.currentTarget.dataset.id
   var curIndex = this.data.curIndex
   console.log('curIndex', curIndex)
   var mark = 'cid' + cid + 'id' + id
    total = this.data.total
    console.log('mark',mark)
    console.log('total数', total.count, '总价', total.money)
    let shopItemData = this.data.shopItemData
    console.log('shopItemData', shopItemData)
    console.log('dishes', shopItemData.data[0].dishes)
    let menu = shopItemData.data.find(function (v) {
      return v.id == cid
    })
    var dish = menu.dishes.find(function (v) {
      return v.id == id
    })
    zcid = --id
    // zcid = 'zcid:' + id
    dish.count += 1;
    total.count += 1;
    total.money = Math.round(dish.price * 100 + total.money * 100) / 100
    // zcid = describe.concat(zcid)
    // name = describe.concat(dish.name)
    // price = describe.concat(dish.price)
    // count = describe.concat(dish.count)
    //
    // id = ++id
    var price = this.data.shopItemData.data[curIndex].dishes[zcid].price;
    var num = this.data.shopItemData.data[curIndex].dishes[zcid].count;
    var name = this.data.shopItemData.data[curIndex].dishes[zcid].name;
    describe = describe.concat(zcid, dish.name, dish.price, dish.count)// 
    var obj = { zcid: zcid, num: num, name: name, price: price, mark: mark,id: id, cid: cid };
    var carArray1 = this.data.carArray.filter(item => item.mark != mark)
    carArray1.push(obj)
    console.log('carArray1', carArray1)
    // console.log('总describe', describe)
    // console.log('总dish',dish)
    // console.log(dish.count, total.count)
    console.log(zcid, name, price, count)
    this.setData({
      "shopItemData": shopItemData,
       'carArray': carArray1,
      'total': total
    })
    // var index = e.currentTarget.dataset.itemIndex;
    // var parentIndex = e.currentTarget.dataset.parentindex;
    // this.data.goods[parentIndex].foods[index].Count++;
    // var mark = 'a' + index + 'b' + parentIndex
    // var price = this.data.goods[parentIndex].foods[index].price;
    // var num = this.data.goods[parentIndex].foods[index].Count;
    // var name = this.data.goods[parentIndex].foods[index].name;
    // var obj = { price: price, num: num, mark: mark, name: name, index: index, parentIndex: parentIndex };
    // var carArray1 = this.data.carArray.filter(item => item.mark != mark)
    // carArray1.push(obj)
    // console.log(carArray1);
    // this.setData({
    //     carArray: carArray1,
    //     goods: this.data.goods
    // })
    // this.calTotalPrice();
    // this.setData({
    //     payDesc: this.payDesc()
    // })

  },
  //减号商品
  minusCount: function (event) {
    var cid = event.currentTarget.dataset.cid
    var id = event.currentTarget.dataset.id
    var curIndex = this.data.curIndex
    console.log('curIndex', curIndex)
    var mark = 'cid' + cid + 'id' + id
    total = this.data.total
    console.log('mark', mark)
    console.log('total数', total.count, '总价', total.money)
    let shopItemData = this.data.shopItemData
    console.log('shopItemData', shopItemData)
    console.log('dishes', shopItemData.data[0].dishes)
    //
    
    let menu = shopItemData.data.find(function (v) {
      return v.id == cid
    })
    let dish = menu.dishes.find(function (v) {
      return v.id == id
    })
    if (dish.count <= 0)
      return
    dish.count -= 1;
    total.count -= 1
    total.money = Math.floor(total.money * 100 - dish.price * 100) / 100

    zcid = --id

    var price = this.data.shopItemData.data[curIndex].dishes[zcid].price;
    var num = this.data.shopItemData.data[curIndex].dishes[zcid].count;
    var name = this.data.shopItemData.data[curIndex].dishes[zcid].name;
    describe = describe.concat(zcid, dish.name, dish.price, dish.count)// 
    var obj = { zcid: zcid, num: num, name: name, price: price, mark: mark, id: id, cid: cid };
    var carArray1 = this.data.carArray.filter(item => item.mark != mark)
    carArray1.push(obj)
    console.log('carArray1', carArray1)
    
    describe.splice(describe.lastIndexOf(zcid), 4)
    console.log('减号：', describe)

    this.setData({
      'shopItemData': shopItemData,
      'carArray': carArray1,
      'total': total
    })
  },
  shopTo: function () {
    wx.navigateTo({
      url: '/pages/index/gouwu/gouwu'
    })
  },
  //彈起購物車
  toggleList: function () {
    console.log('111tan')
    if (!total.count) {
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
    console.log(fold);
    if (fold == false) {
      this.setData({
        cartShow: 'block',
      })
    } else {
      this.setData({
        cartShow: 'none',
      })
    }
    console.log(this.data.cartShow);
  },
  //去付款
  formSubmit: function (res) {
    //console.log(shopItemData.data[0])
    var that = this
    wx.getStorage({
      key: 'jsopenid',
      success: function (res) {
        // success
        openid = res.data
        console.log(openid)
        console.log(describe)
        if (describe == '') {
          wx.showModal({
            content: '请选择商品'
          })
        } else {
          wx.request({
            url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/serviceOrder/add',
            data: {
              openid: openid,
              describe: describe,
              price: total.money,
              type: 3
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            // header: {}, // 设置请求的 header
            success: function (res) {
              console.log('提示：', res)
              if (res.data.code != 200) {
                wx.showModal({
                  content: '唤起支付失败',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('请重新付款')
                    }
                  }
                })
              } else {
                var sign = ""
                var MD5Util = require('../../../utils/md5.js');
                var timeStamp = (Date.parse(new Date()) / 1000).toString();
                console.log('timeStamp:', timeStamp)
                //var timeStamp = res.data.data.timeStamp;
                var appid = res.data.data.appId
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
                          // console.log(res)
                          wx.request({
                            url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Maintenance/postBreakInfo',
                            //oid：订单编号 aprice：实付金额 status：付款状态（0未 1已）
                            data: {
                              openid: openid,
                              oid: oid,
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
                                  content: '早餐购买成功，请到消息中心-掌家服务内查看',
                                })
                                // wx.showModal({
                                //   content: '支付成功!',
                                //   success: function (res) {
                                //     if (res.confirm) {
                                //       wx.navigateBack({
                                //         delta: 2
                                //       })
                                //       console.log('成功')
                                //     } else {
                                //       wx.navigateBack({
                                //         delta: 2
                                //       })
                                //     }
                                //   }
                                // })
                              }

                            }

                          })
                          

                        }
                      })

                    } else {

                    }
                  }
                })

              }
              describe = describe
              console.log('得到：', describe)
              that.setData({
                describe: describe
              })
              describe = []
              that.setData({
                total: {
                  count: 0,
                  money: 1
                },
                shopItemData: shopItemData
              })
            }
          })

        }
      }
    })
  },

  onLoad: function () {
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
            console.log("res:", res)
            if (res.data.code != 200) {
              // 页面初始化 options为页面跳转所带来的参数
              // console.dir("the page is onLoad");
              // console.log(shopItemData.data)

              //console.log("最后一个是shoppItemData")
              // console.log(shopItemData)
              /* wx.showModal({
                content:'请先进行业主认证并联系物业',
                success: function(res) {
                  wx.navigateBack({
                    delta: 1           
                  })
                }
              })*/
            } else {
              describe = []
            }
          }
        })
      }
    })

  }
})