var openid = ''
var textarea = ''
const app = getApp()
var mpic = ''
var nickname = ''
Page({
  data: {
    textarea:'',
    imageList: [],
    userInfo:{}
  },

  onLoad: function () {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    //console.log(this.data.userInfo)
    
  },
  //选择图片
  chooseImage: function () {
    var that = this
    if (this.data.imageList.length < 5) {
      wx.chooseImage({
        count: 5-that.data.imageList.length,
        success: function (res) {
          //console.log(res)
          var newimg = res.tempFilePaths
          var imgArray = that.data.imageList
          imgArray = imgArray.concat(newimg)
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
    var that = this
    //console.log(e)
    var num = e.target.dataset.index
    wx.showModal({
      content: '确定要删除这张图片吗',
      success: function (res) {
        if (res.confirm) {
          var myArray = that.data.imageList
          myArray.splice(num, 1)
          that.setData({
            imageList: myArray
          })
        }
      }
    })
  },

  //发布
  onPushSubmit: function (e) {
    //console.log(e)
    var that = this
    textarea = e.detail.value.content
    var tempFilePaths = this.data.imageList
    var lid = tempFilePaths.length
    if (!(textarea.replace(/(^\s*)|(\s*$)/g, ''))) {
      wx.showModal({
        content: '内容不能为空！',
        showCancel: false,
      })
    } else if (!lid) {
      wx.showModal({
        content: '图片不能为空！',
        showCancel: false,
      })
    } else{
      nickname = this.data.userInfo.nickName
      mpic = this.data.userInfo.avatarUrl
      wx.getStorage({
        key: 'jsopenid',
        success: function (res) {
          //console.log(res)
          openid = res.data
          wx.request({
            url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Neighborhood/addNeighoorhood',
            data: {
              openid: openid,
              content: textarea,
              mpic: mpic,
              nickname: nickname,
            },
            method: 'GET',
            success: function (res) {
              //console.log(res)
              var pid = res.data.data
              if (res.data.code === 200) {
                var index
                for (index in tempFilePaths) {
                  wx.uploadFile({
                    url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Neighborhood/updateNeiPic',
                    filePath: tempFilePaths[index],
                    name: 'photo',
                    formData: {
                      openid: openid,
                      id: pid,
                      num: parseInt(index)+1
                    },
                    success: function (res) {
                      var returnres = JSON.parse(res.data)
                      console.log(JSON.parse(res.data))
                      if (returnres.code == 200) {
                        wx.showModal({
                          content: '发布成功',
                          showCancel: false,
                          success: function (res) {
                            if (res.confirm) {
                              wx.showLoading({
                                title: '加载中',
                                mask: true,
                              })
                              setTimeout(function () {
                                wx.reLaunch({
                                  url: '../index/index',
                                })
                                wx.hideLoading()
                              }, 2000)
                            }
                          }
                        })
                      } else {
                        wx.showModal({
                          content: '发布失败',
                          showCancel: false,
                          success: function (res) {
                            if (res.confirm) {
                              wx.showLoading({
                                title: '加载中',
                                mask: true,
                              })
                              setTimeout(function () {
                                wx.reLaunch({
                                  url: '../index/index',
                                })
                                wx.hideLoading()
                              }, 2000)
                            }
                          }
                        })
                      }
                    },
                  })
                } 
              } else {
                wx.showModal({
                  content: '发布失败',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      wx.showLoading({
                        title: '加载中',
                        mask: true,
                      })
                      setTimeout(function () {
                        wx.reLaunch({
                          url: '../index/index',
                        })
                        wx.hideLoading()
                      }, 2000)
                    }
                  }
                })
              }
            },
            fail: function () {
              wx.showLoading({
                title: '加载中',
                mask: true,
              })
              setTimeout(function () {
                wx.reLaunch({
                  url: '../index/index',
                })
                wx.hideLoading()
              }, 2000)
            }
          })
        }
      })
    }
  },
})