const app = getApp()
var img = app.globalData.img
var openid=''
var vstatus=''
var type=0
Page({
  data: {
    img:img,
    interval: 3000,
    duration: 800,
    etc_url: ""
  },
  
  onLoad: function () {
    //获取小区id
    wx.getStorage({
      key: 'jsopenid',
      success: function (res) {
        openid = res.data
        wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/article/getMemberInfo',
          data: {
            openid: openid,
          },
          method: 'GET',
          success: function (res) {
            console.log("res:", res)
            if (res.data.code == 200) {
              var residential_id = res.data.data[0].residential_id
              // residential_id=15
              //浅水湾区
              if (residential_id == "7") {
                that.setData({
                  etc_url: "../index/caller/caller"
                })
              }
              // 文园雅阁
              if (residential_id == 13 || residential_id == 14 || residential_id == 15 || residential_id==16){
                that.setData({
                  etc_url: "../index/callera/callera"
                })
              }
              
              // this.setData({
              //   etc_url:"callera/callera"
              // })
            }
          }
        })
      }
    })
    var that = this
    var isVerify = app.globalData.isVerified
    //console.log(isVerify)
    if (isVerify == 0) {
      wx.showModal({
        title: '未认证',
        content: '请到我的>资料填写进行认证',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../my/mycom/mycom',
            });
            //console.log('用户点击确定')
          }
        }
      })
    } else if (isVerify == 1) {
      wx.showModal({
        title: '您已提交',
        content: '请耐心等候物业进行认证',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            //console.log('用户点击确定')
          }
        }
      })
    }
  },
  
  

  //请等待
  showTo: function (e) {
    const dataset = e.currentTarget.dataset
    console.log(dataset.index)
    if (dataset.index==0){
      wx.showModal({
        title: '本小区暂未开通此服务!',
        showCancel: false,
      })
    } else {
      wx.showModal({
        title: '敬请期待！',
        showCancel: false,
      })
    }
  },

  //跳转页面
  onNavigateTap(e) {
    var isVerify = app.globalData.isVerified
    const dataset = e.currentTarget.dataset, url = dataset.url, notice = dataset.notice, nav = { url: url + '?notice=' + JSON.stringify(notice) };
    if (isVerify == 0) {
      wx.showModal({
        title: '未认证',
        content: '请到我的>资料填写进行认证',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../my/mycom/mycom',
            });
            //console.log('用户点击确定')
          }
        }
      })
    } else if (isVerify == 1) {
      wx.showModal({
        title: '您已提交',
        content: '请耐心等候物业进行认证',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            wx.navigateBack({

            })
            //console.log('用户点击确定')
          }
        }
      })
    } else {
        wx.navigateTo(nav);
    }
    //if (dataset.invalid) return;
    //console.log(type == "switch");
    //if ("switch" == type) {
    //nav.fail = function () {
    //wx.navigateTo({ url: url });
    //};
    //wx.navigateTo({ url: url });
    //} else {
    //wx.navigateTo(nav);
    //}
  },

  caryeTo:function() {

  },

  /*kindToggle:function(e){
    var that=this
    var id = e.currentTarget.id, list = this.data.list;
    if(id=="zaocan") type=3
    if(id=="carye")  type=8
    if(id=="dangri") type=7
    if(id=="kuaidi") type=2
    if(id=="baoxiu") type=9
    if(type == 9){
      wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Maintenance/index',
          data: {
            openid:openid
          },
          method: 'GET', 
          success: function(res){
            console.log('信息',res)
            if(res.data.code!=200){
              wx.showModal({
                title:'无信息内容'
              })
            }else{
              
            console.log('demo',res.data.data[0].status)
            if(res.data.data[0].status == 0) { 
                  vstatus = ["为您报修"]
                }else if(res.data.data[0].status == 1){
                  vstatus = ["正在处理"]
                }else{
                  vstatus = ["维修完成"]
                }
              for (var i = 0, len = list.length; i < len; ++i) {
                if (list[i].id == id) {
                  list[i].pages=vstatus;
                  list[i].open = !list[i].open;
                  list[i].name=list[i].name2;
                }else{
                  list[i].open = false
                  list[i].name=list[i].name1;
                } 
              }
              that.setData({
                list:list
              })  
            }   
            console.log('数据',list)
            console.log('报修内容',vstatus)
          }
       })
       
    }else{
        wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/serviceOrder/newOrder',
          data: {
            openid:openid,
            type:type
          },
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          success: function(res){
            console.log(res.data)
            if(res.data.code!=200){
              wx.showModal({
                title:'无信息内容'
              })
            }else{
              console.log('订单',res)
              if(type == 3)
              {
                if(res.data.data[0].status == 0) { 
                  vstatus = ["订单已接收"]
                }else if(res.data.data[0].status == 1){
                  vstatus = ["订单进行中"]
                }else{
                  vstatus = ["订单已完成"]
                } 
              }
              else if(type == 8)
              {
                if(res.data.data[0].status == 0) { 
                  vstatus = ["需要洗车"]
                }else if(res.data.data[0].status == 1){
                  vstatus = ["正在洗车"]
                }else{
                  vstatus = ["已清洗完"]
              }
              }
              else if(type == 2)
              {
                if(res.data.data[0].status == 0) { 
                  vstatus = ["为您下单"]
                }else if(res.data.data[0].status == 1){
                  vstatus = ["揽收快递"]
                }else{
                  vstatus = ["快递寄出"]
                }
              }
              else if(type == 7){
                  if(res.data.data[0].status == 0) { 
                  vstatus = ["为您下单"]
                }else if(res.data.data[0].status == 1){
                  vstatus = ["揽收快递"]
                }else{
                  vstatus = ["当日寄达"]
                }
              }
              for (var i = 0, len = list.length; i < len; ++i) {
                if (list[i].id == id) {
                  list[i].pages=vstatus;
                  list[i].open = !list[i].open;
                  list[i].name=list[i].name2;
                }else{
                  list[i].open = false
                  list[i].name=list[i].name1;
                } 
              }
              that.setData({
                list:list
              })
          }
          console.log('内容',vstatus)
          }
        })
    }

  },*/

})

