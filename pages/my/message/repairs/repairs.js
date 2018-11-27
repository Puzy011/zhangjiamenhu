
var openid=''
var title=[]
Page({
  data:{
    fuwu:{}
  },
  onLoad:function(options){
    var that=this
    wx.getStorage({
      key: 'jsopenid',
      success: function(res){
        openid=res.data
        wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Maintenance/getMaintenanceList',
          data: {
            openid:openid
          },
          method: 'GET',
          success: function(res){
            //console.log('检查：',res.data)
            title=res.data.data
            if(res.data.code==200){
              that.setData({
                fuwu:title,
              })
            }
          }
        })
      }
    })
  }
})