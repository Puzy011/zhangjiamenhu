// pages/server/goods/housekeeping/housekeeping.js
const app = getApp()
var img = app.globalData.img 
var openid = ''
var type = ''
Page({
  data: {
    img: img,
    clock: '',
    total_micro_second: '',
    list: [],
    wxTimer: {},
    wxTimerList: {},
    id: '',
    /*grids: [{
        id: 0,
        image: img + 'du-LOGO.jpg',
        name: "日常保洁",
        txt: "【首单满12-5/满22减10】",
      }, {
        id: 1,
        image: img + 'wu-logo.jpg',
        name: "家电清洗",
        txt: "【首单满12-5/满22减10】",
      }, {
        id: 2,
        image: img + 'wu-logo.jpg',
        name: "大扫除",
        txt: "【首单满12-5/满22减10】",
      }, {
        id: 3,
        image: img + 'du-LOGO.jpg',
        name: "日常保洁",
        txt: "【首单满12-5/满22减10】",
      }, {
        id: 4,
        image: img + 'wu-logo.jpg',
        name: "家电清洗",
        txt: "【首单满12-5/满22减10】",
      }, {
        id: 5,
        image: img + 'wu-logo.jpg',
        name: "大扫除",
        txt: "【首单满12-5/满22减10】",
      }, {
        id: 6,
        image: img + 'du-LOGO.jpg',
        name: "日常保洁",
        txt: "【首单满12-5/满22减10】",
      }, {
        id: 7,
        image: img + 'wu-logo.jpg',
        name: "家电清洗",
        txt: "【首单满12-5/满22减10】",
      }, {
        id: 8,
        image: img + 'wu-logo.jpg',
        name: "大扫除",
        txt: "【首单满12-5/满22减10】",
      }
    ],
    content: [
      {
        id: 1,
        image: img + 'du-LOGO.jpg',
        name: "日常保洁",
        txt: "【首单满12-5/满22减10】",
      }, {
        id: 2,
        image: img + 'wu-logo.jpg',
        name: "家电清洗",
        txt: "【首单满12-5/满22减10】",
      }, {
        id: 3,
        image: img + 'wu-logo.jpg',
        name: "大扫除",
        txt: "【首单满12-5/满22减10】",
      }
    ]*/
  },

  onLoad: function (options) {
    var that = this 
    //console.log(new Date())
    //console.log(this.data.time)
    wx.request({
      url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/payment/getHomeServiceList',
      method: 'GET',
      success: function (res) {
        //console.log(res)
        that.setData({
          list: res.data.data,
        })
        count_down(that);
      }
    })
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
  var total_micro_second = total*1000
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
  var hhr = Math.floor(hr - dy*24);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));
  return dy+ "天" + hhr + ":" + min + ":" + sec ;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}