// pages/my/list/list.js
//获取应用实例
var img = require('../../../config')
import NumberAnimate from "../../../utils/NumberAnimate";
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img: img,
    curIndex: 0,
  },
  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },
  creditTo: function () {
    wx.navigateTo({
      url: '../credit/credit'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      num1: '',
     
      num1Complete: '',
      num1Complete_: '',
      btn_show: false
      
    });

    let num1 = 3;
    let n1 = new NumberAnimate({
      from: num1,//开始时的数字
      speed: 2000,// 总时间
      refreshTime: 100,//  刷新一次的时间
      decimals: 0,//小数点后的位数
      onUpdate: () => {//更新回调函数
        this.setData({
          num1: n1.tempValue
        });
      },
      onComplete: () => {//完成回调函数
        this.setData({
          num1Complete: "信用良好",
          num1Complete_: "评估时间：2017-09-23",
          btn_show:true
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
   //调用NumberAnimate.js中NumberAnimate实例化对象，测试3种效果
  animate: function () {

    this.setData({
      num1: '',
      num2: '',
      num3: '',
      num1Complete: '',
      num2Complete: '',
      num3Complete: ''
    });

    let num1 = 18362.856;
    let n1 = new NumberAnimate({
      from: num1,//开始时的数字
      speed: 2000,// 总时间
      refreshTime: 100,//  刷新一次的时间
      decimals: 3,//小数点后的位数
      onUpdate: () => {//更新回调函数
        this.setData({
          num1: n1.tempValue
        });
      },
      onComplete: () => {//完成回调函数
        this.setData({
          num1Complete: " 完成了"
        });
      }
    });

    let num2 = 13388;
    let n2 = new NumberAnimate({
      from: num2,
      speed: 1500,
      decimals: 0,
      refreshTime: 100,
      onUpdate: () => {
        this.setData({
          num2: n2.tempValue
        });
      },
      onComplete: () => {
        this.setData({
          num2Complete: " 完成了"
        });
      }
    });

    let num3 = 2123655255888.86;
    let n3 = new NumberAnimate({
      from: num3,
      speed: 2000,
      refreshTime: 100,
      decimals: 2,
      onUpdate: () => {
        this.setData({
          num3: n3.tempValue
        });
      },
      onComplete: () => {
        this.setData({
          num3Complete: " 完成了"
        });
      }
    });
  }
})


