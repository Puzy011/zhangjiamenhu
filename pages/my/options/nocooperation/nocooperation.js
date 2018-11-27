// pages/my/approve/approve.js
var openid=''
const app = getApp()
var img = app.globalData.img
var i=0
var arr=[]
var radiov=''
var radiovs=''
var openid=''
var Subscript=''
var allid=[]
var plot=''
var position=''
var wuyename=''
var wuyeuser=''
var banktype=''
var wyphone=''
var Building=''
Page({
    data:{
        phone: '请输入您的手机号码',
        Name:'请输入您的姓名',
        Building:'请输入您地址',
        wyuser:'请输入物业银行卡卡号',
        userInfo:{},
        img:img,
        kaisuotp:img+"xianshi_off.png",
        state:"点击图片进行定位",
        userInfo: {},
        //subMenuDisplay:initSubMenuDisplay(),
        //定位
        positioning:"点击进行定位",
    },
  //定位测试
  chooseLocation: function () {
    var that = this
    console.log('所有的值',this)
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        that.setData({
          hasLocation: true,
          Building:res.address,
          dizhi:res.address
          //louhu:res.address
        })
      }
    })
  },  
  listenerPhoneInput: function(e) {
     this.data.phone = e.detail.value;

  },
  //手机号
   phone:function(e){
      var value = e.detail.value;
      //手机号号判断
      var regNum=new RegExp('(^1[3|4|5|7|8][0-9]{9}$)','g');
       var res=regNum.exec(value);
      if(!res){
        this.setData({tip:'手机号码格式不正确!'})
      }else{
        this.setData({tip:''})
      }
     
      this.setData({phone:value})
  },
  //姓名
  Name:function(e){
      var value = e.detail.value;
      var regNum= new RegExp('/^[a-zA-Z0-9_\.]+$/');
      var res=regNum.exec(value);
      this.setData({Name:value})
      console.log('姓名',e.detail.value)
  },
  //地址
   Building:function(e){
      var value = e.detail.value;
      var regNum= new RegExp('/^[a-zA-Z0-9_\.]+$/');
      var res=regNum.exec(value);
      this.setData({Building:value})
      console.log('地址',e.detail.value)
  },
  //定位
  positionTo:function(e){
    console.log('定位',e.detail.value)
    position = e.detail.value
  },
  //物业名称
  wynameTo:function(e){
    console.log('名称',e.detail.value)
    wuyename = e.detail.value
  },
  //银行卡号
  wyuserTo:function(e){
    console.log('物业卡号',e.detail.value)   
     wuyeuser = e.detail.value  
  },
  //小区名字
  plotTo:function(e){
    console.log('小区名字',e.detail.value)   
    plot = e.detail.value   
  },
  //银行类型
  bankTo:function(e){
    console.log('银行类型',e.detail.value)   
    banktype = e.detail.value   
  },
  //物业电话
  wyphoneTo:function(e){
    console.log('物业电话',e.detail.value)   
    wyphone = e.detail.value   
  },
  formSubmit: function(e) {
   var that=this 
   console.log('所有',this.data) 
   var phone = this.data.phone  //手机号
   var username = this.data.Name //姓名
   var address = this.data.Building //地址
   console.log('手机:',phone)
   console.log('姓名:',username)
   console.log('地址:',address)
   console.log('openid:',openid)
   //console.log('定位:',position)
   console.log('名称:',wuyename)   
   console.log('账户:',wuyeuser)
   console.log('小区名字:',plot)
   console.log('银行类型:',banktype)
   console.log('物业电话:',wyphone)
   
   if(phone=='请输入您的手机号码'){
     wx.showModal({
       content:'请输入您的手机号码'
     })
   }else if(username=='请输入您的姓名'){
     wx.showModal({
       content:'请输入您的名字'
     })
   }else if(address=='请输入您地址'){
     wx.showModal({
       content:'请输入您地址'
     })
   }else if(plot==''){
     wx.showModal({
       content:'请输入小区名称'
     })
   }else if(wuyename==''){
     wx.showModal({
       content:'请输入物业名称'
     })
   }else if(wuyeuser==''){
     wx.showModal({
       content:'请输入物业银行卡号'
     })
   }else if(banktype==''){
     wx.showModal({
       content:'请输入银行卡类型'
     })
   }else if(wyphone==''){
     wx.showModal({
       content:'请输入物业电话'
     })
   }else{
   wx.request({
     url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Article/memberRelation',
     data: {
       openid:openid,
       phone:phone,
       name:username,
       address:address,
       resname:plot,  //小区名称
       wname:wuyename,// 物业名称
       bankcard:wuyeuser, //物业银行卡号
       bankname:banktype, //银行卡类型
       wphone:wyphone //物业电话

     },
     method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
     header: {}, // 设置请求的 header
     success: function(res){
       // success
      console.log("res:",res.data.data);
      console.log('bangding:',res)
      if(res.data.code==200){
         wx.showModal({
            title: '信息递交成功',
            content:res.data.message,
            success: function(res) {
              console.log('信息',res)
              
              if (res.confirm) {
                console.log('请重新认证')
                wx.navigateBack({
                  delta: 2
                })
              }
              setTimeout(function(){
                  that.setData({kaisuotp:img+"xianshi_on.png"});
                  that.setData({
                    state:"您还尚未绑定小区,请您立即绑定小区享受服务！"})
                  },1000)
            }
         })
       }else{ 
         that.setData({
           kaisuotp:img+"xianshi_off.png",
           state:"如您已搬离小区,请及时更换！"
           });
         wx.showModal({
           content:'认证成功',
           duration: 2000,
           success:function(){
             wx.navigateBack({
               delta: 1
             })
           }
         })
       }
     }
   })
   }
  }, 
 
    onLoad:function(){
        console.log('自主缴费')
        console.log('my loading')
        var that=this;
        wx.getStorage({
          key: 'jsopenid',
          success: function(res){
              openid=res.data 
              //console.log('openid:',openid)
          }
        })
    },
})
