var img = require('../../../../config')
var day=[]
var openid=''
var prices=''
var value=''
var values=''
var i=0
var delivery=''
var jijian=''
var time=''
var allk=''
Page({
  data: {
    img:img,
    time: '选取时间',
    price:"0.01" , //1
    selects:true
  },
  bindTimeChange: function(e) {
    time=e.detail.value
    this.setData({
      time: time
    })
  },
 siteTo:function(e){
      jijian = e.detail.value;
      this.setData({siteTo:jijian})
  },
  messageTo:function(e){
      var value = e.detail.value;
      this.setData({messageTo:value})
  },
  
   furnishing: function () {
    wx.navigateTo({ 
      url:'kuaidi/kuaidi' 
      })
  },
  //显示价格
   showPrice:function(){
    if(this.data.state=="xiao"){
        this.setData({price:"0.01"}); //5
    }else if(this.data.state=="zhong"){
        this.setData({price:"8"});
    }else if(this.data.state=="da"){
        this.setData({price:"10"});
    }
  },
  //包月单词选择
   radioChange: function(e) {
     value=e.detail.value;
     this.setData({state:value});
     this.showPrice();
  },
   radioChanges: function(e) {
     values=e.detail.value;
     this.setData({state:values});
     this.showPrice();
  },
  //提交 
  judge:function(e){
    var that=this
    day=[]
    box=''
    allk=''
    if(values=="BSHT"){
          allk="百世汇通" 
    }
    if(values=="shunfei"){
         allk="顺丰速运"
    }
    if(values=="yunda"){
         allk="韵达快运"
    }
    if(values=="shengtong"){
         allk="申通快递"
    }
    if(values=="yuantong"){
          allk="圆通速递"
    }
    if(values=="quanyi"){
          allk="全一快递"
    }
    if(values=="zhongtong"){
         allk="中通快递"
    }
    if(values=="tiantian"){
          allk="天天快递"
    }
    if(values=="yousu"){
          allk="优速快递"
    }
    if(value=="zhong"){var box="中"}
    if(value=="da") {var box="大"}
    if(value=="xiao") {var box="小"}
    day=day.concat('地址:',this.data.siteTo,'留言：',this.data.messageTo,'时间：',this.data.time,'打包盒：',box,'选择快递：',allk)
    console.log('day:',day)
    prices=this.data.price
    wx.getStorage({
      key: 'jsopenid',
      success: function(res){
        // success
        openid=res.data
        console.log(openid)
        if(jijian==''){
          wx.showModal({
            content:'请输入寄到哪里'
          })
        }else if(time==''){
          wx.showModal({
             content:'请选择时间'
          })
        }else if(allk==''){
          wx.showModal({
              content:'请选择快递'
          })
        }else if(value==''){
          wx.showModal({
               content:'请选择打包盒'
          })
        }else if(prices=='3'){
          wx.showModal({
               content:'请重新输入所有值'
          })
        }
        else{
        wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/serviceOrder/add',
          data: {
            openid:openid,
            describe:day,
            price:prices,
            type:2
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          // header: {}, // 设置请求的 header
          success: function(res){
            if(res.data.code!=200){
               wx.showModal({
                  content:res.data.message
             })
            }else{
              var sign = ""
                  var MD5Util = require('../../../../utils/md5.js');  
                  var timeStamp = (Date.parse(new Date()) / 1000).toString();
                  console.log('res:',timeStamp)
                  //var timeStamp = res.data.data.timeStamp;
                  var appid = res.data.data.appId
                  var nonceStr = res.data.data.nonceStr
                  var pkg = res.data.data.package
                  var key = res.data.data.key
                  
                  var signA = "appId="+appid+"&nonceStr="+nonceStr+"&package="+pkg+"&signType=MD5&timeStamp="+timeStamp;  
                  var signB = signA+"&key="+key; 
                  sign = MD5Util.MD5(signB).toUpperCase(); 
                  console.log('SIGNB:',sign)
                  wx.showModal({
                    title: '注意',
                    content: '付款之后订单将不能取消',
                    success: function(res){
                      if (res.confirm) {
                        console.log('用户点击确定',res) 

                    wx.requestPayment({
                      timeStamp: timeStamp,
                      nonceStr: nonceStr,
                      package: pkg,
                      signType: 'MD5',
                      paySign: sign,
                      success: function(res){
                        // success
                        console.log('success')
                        console.log(res)
                        that.setData({price:'3'}) 
                        wx.navigateBack({
                            delta: 1
                        })
                      }
                    })
                     
                    }else{
                      
                    }
                    }
                  })
                    //that.setData({price:'3'})
            }    
          }
        })
        }
      }   
    })
    
  },
  onLoad:function(){
    var that = this
    day=[]
    time=''
    value=''
    values=''
    jijian=''
        wx.getStorage({
          key: 'jsopenid',
          success: function(res){
              openid=res.data 
              wx.request({
                url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/article/getMemberInfo',
                data: {
                  openid:openid
                },
                method: 'GET',
                success: function(res){
                  console.log("res:",res)
                  /*if(res.data.code!=200){
                    wx.showModal({
                      content:'请先进行业主认证并联系物业',
                      success: function(res) {
                        wx.navigateBack({
                          delta: 1           
                        })
                      }
                    })
                  }*/ 
                }
              })
          }
        })
    
  }
})
 
