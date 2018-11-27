// pages/my/message/jiaofei/jiaofei.js
var openid=''
var title=[]
var paymoney=[]
var time=[]
var order_number=[]
Page({
  data:{
    fuwu: {},
    jiaofei: '',
    paymoney: '',
    time: '',
    order_number: ''
  },
  onLoad:function(options){
    var that=this
    wx.getStorage({
      key: 'jsopenid',
      success: function(res){
        openid=res.data
        wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/payment/porder',
          data: {
            openid:openid
          },
          method: 'GET', 
          success: function(res){
            //console.log(res)
            //console.log(res.data.code)
            title=res.data.data
            //console.log('data',title)
            paymoney=res.data.data
            // console.log(paymoney)
            time=res.data.data
            // console.log(time)
            order_number=res.data.data
            // console.log(order_number)
            if(res.data.code==200){
            that.setData({
                jiaofei:title,
                paymoney:paymoney,
                time:time,
                order_number:order_number
            })
            }
          }
        })
      }
    })
  }
})