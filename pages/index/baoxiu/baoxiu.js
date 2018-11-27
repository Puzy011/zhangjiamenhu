var openid = ''
var textarea = ''
var touch_start=''
var touch_end=''
Page({
  data: {
    baoxiuxinxi: '请描述故障内容，掌家将为您联系报修（注：当您提交故障信息是，管家会默认往您在业主认证时填写的位置，如有其它情况请您在报修中备注，图片一次只能选一张）',
    imageList: []
  },

  onLoad: function () {
    var that = this
    wx.getStorage({
      key: 'jsopenid',
      success: function (res) {
        openid = res.data
        /*wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/article/getMemberInfo',
          data: {
            openid: openid
          },
          method: 'GET',
          success: function (res) {
            console.log(res)
          }
        })*/
      }
    })
  },

  //选择图片
  chooseImage: function () {
    var that = this
    if (this.data.imageList.length < 1) {
      wx.chooseImage({
        count: 1,
        success: function (res) {
          //console.log(res)
          var newimg = res.tempFilePaths[0]
          var imgArray=that.data.imageList
          imgArray.push(newimg)
          that.setData({
            imageList: imgArray
          })
          //console.log(that.data.imageList)
        }
      })
    } else {
      wx.showModal({
        content: '不能再选择更多图片了',
        showCancel: false,
      })
    }
  },

  //发布报修
  Repair: function (e) {
    console.log(e)
    var that = this
    textarea = e.detail.value.content
    var tempFilePaths = this.data.imageList
    var lid = tempFilePaths.length
    if (!(textarea.replace(/(^\s*)|(\s*$)/g, ''))){
      wx.showModal({
        content: '内容不能为空！',
        showCancel: false,
      })
    } else if (!lid) {
      wx.showModal({
        content: '图片不能为空！',
        showCancel: false,
      })
    } else {
      wx.getStorage({
        key: 'jsopenid',
        success: function (res) {
          openid = res.data
          wx.uploadFile({
            url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Maintenance/getMaintenance',
            filePath: tempFilePaths[0],
            name: 'photo',
            formData: {
              openid: openid,
              describe: textarea,
              type: 9,
              form_id: e.detail.formId
            },
            success: function (res) {
              var data = res.data
              //console.log(res)
              wx.showModal({
                content: '报修发布成功',
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                }
              })
            }
          })
        }
      })
    }
  },

  //查看大图
  previewImage: function (e) {
    //console.log(e)
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
    
  },
  //取消选择
  removeimg: function (e) {
    var that=this
    //console.log(e)
    var num=e.target.dataset.index
    wx.showModal({
      content: '确定要删除这张图片吗',
      success: function (res) {
        if (res.confirm) {
          var myArray = that.data.imageList
          myArray.splice(num,1)
          that.setData({
            imageList:myArray
          })
        } 
      }
    })
  }
})