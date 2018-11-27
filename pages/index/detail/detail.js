
const app = getApp()
var img = app.globalData.img
var openid = ''
var nickname = ''
var mpic = ''
var pic = ''
var content = ''
var piclist = []
var time = ''
var i = 0
var click = ''
var number = ''
var id = ''
var rid=''
var admin_id = ''
var type = ''
var is_good = false
var is_my = false
Page({
  id: null,
  data: {
    img: img,
    review: '评论',
    click: 0,
    number: 0,
    userInfo: {},
    comments: [],
    piclist: [],
    isEmpty: false,//数据是否为空
    hasMore: true,//是否还有更多数据
    page: 1,//当前请求的页数
    top_day: 1,
    isShowTop: false,
    isShowActionMenu: false,
    isActive: false,
    is_good: false,
    show_comment: false
  },
  
  onNavigateTap(e) {
    wx.navigateTo({ url: e.currentTarget.dataset.url });
  },

  onLoad: function (e) {
    //console.log(e)
    rid=e.id
    var that = this
    wx.getStorage({
      key: 'jsopenid',
      success: function (res) {
        //console.log(res)
        openid = res.data
        wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Neighborhood/getNeighborhoodInfo',
          data: {
            id: e.id,
            openid: openid
          },
          method: 'GET',
          success: function (res) {
            //console.log(res)
            nickname = res.data.data[i].nickname
            mpic = res.data.data[i].mpic
            pic = res.data.data[i].pic
            content = res.data.data[i].content
            time = res.data.data[i].time
            click = res.data.data[i].click
            number = res.data.data[i].number
            admin_id = res.data.data[i].admin_id
            var type = res.data.data[i].type
            var is_good = res.data.data[i].is_good
            var is_my = res.data.data[i].is_my
            if (res.data.code != 200) {
              wx.showModal({
                showCancel: false,
                content: res.data.message
              })
            } else {
              that.setData({
                id: e.id,
                nickname: nickname,
                content: content,
                pic: pic,
                pic_2: res.data.data[0].pic_2,
                pic_3: res.data.data[0].pic_3,
                pic_4: res.data.data[0].pic_4,
                pic_5: res.data.data[0].pic_5,
                pic_6: res.data.data[0].pic_6,
                pic_7: res.data.data[0].pic_7,
                pic_8: res.data.data[0].pic_8,
                pic_9: res.data.data[0].pic_9,
                mpic: mpic,
                piclist: res.data.data[0].pic_arr,
                time: time,
                click: click,
                number: number,
                type: type,
                is_good: is_good,
                is_my: is_my,
                admin_id: admin_id
              })
            }
          }
        })
        that.tapMainMenu();
      }
    })
  },
  
  /*删除*/
  onDeleteTap(e) {
    var that = this
    wx.showModal({
      title: '温馨提示',
      content: '删除后将不能恢复，你确定要删除这条信息吗？',
      success: (res) => {
        if (res.confirm) {
          wx.getStorage({
            key: 'rid',
            success: function (res) {
              var eid = res.data
              wx.request({
                url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Neighborhood/deleteNeighborhood',
                data: {
                  openid: openid,
                  id: eid
                },
                method: 'GET',
                success: function (res) {
                  //console.log(res.data)
                  if (res.data.code == 200) {
                    wx.showModal({
                      showCancel: false,
                      content: res.data.message
                    })
                    wx.showLoading({
                      title: '加载中',
                      mask: true,
                    })
                    setTimeout(function () {
                      wx.reLaunch({
                        url: '../index',
                      })
                      wx.hideLoading()
                    }, 2000)
                  } else {
                    wx.showModal({
                      showCancel: false,
                      content: res.data.message
                    })
                    wx.showLoading({
                      title: '加载中',
                      mask: true,
                    })
                    setTimeout(function () {
                      wx.reLaunch({
                        url: '../index',
                      })
                      wx.hideLoading()
                    }, 2000)
                  }
                }
              })
            }
          })
        }
        else if (!res.confirm) return;
      }
    });
  },
  
  /*切换功能菜单显示*/
  onToggleShowActionMenuTap(e) {
    this.setData({ isShowActionMenu: !this.data.isShowActionMenu });
  },

  //预览图片
  PreviewTo: function (e) {
    var that = this
    var pic = e.currentTarget.dataset.src
    wx.previewImage({
      current: pic,
      urls: this.data.piclist
    })
  },

  /* 显示评论框*/
  onShowCommentTap(e) {
    this.setData({ show_comment: true });
  },

  /*隐藏评论框*/
  onHideCommentTap() {
    this.setData({ show_comment: false });
  },

  //评论
  onCommentSubmit: function (e) {
    //console.log(e)
    var that = this;
    var nickname = app.globalData.userInfo.nickName
    var pic = app.globalData.userInfo.avatarUrl
    var contents = e.detail.value.content
    var id = this.data.id
    if (!(contents.replace(/(^\s*)|(\s*$)/g, ''))) {
      wx.showModal({
        showCancel: false,
        content: '请输入评论内容',
      })
      return;
    }
    wx.request({
      url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Neighborhood/addComment',
      data: {
        openid: app.globalData.openid,
        nid: id,
        content: contents,
        nickname: nickname
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.code != 200) {
          wx.showModal({
            showCancel: false,
            content: res.data.message
          })
          that.tapMainMenu();
        } else {
          wx.showToast({
            title: '已评论',
            icon: 'success',
            duration: 3000
          });
          var numbers = ++number
          that.setData({
            number: numbers,
            show_comment: false
          });
          that.tapMainMenu();
        }
      }
    })
  },
  
  tapMainMenu: function () {
    var that = this
    wx.request({
      url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Neighborhood/getComment',
      data: {
        openid: openid,
        id: rid
      },
      method: 'GET',
      success: function (res) {
        //console.log(res)
        if (res.data.code != 200) {
          wx.showModal({
            showCancel: false,
            content: res.data.message
          })

        } else {
          that.setData({
            comments: res.data.data,
          })
          //console.log(that.data.comments)
        }
      }
    })
  },

  //点赞
  onGoodTap: function (e) {
    var that = this
    var is_goods = this.data.is_good
    var nid = this.data.id
    var nickname = app.globalData.userInfo.nickName
    var pic = app.globalData.userInfo.avatarUrl
    wx.request({
      url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Neighborhood/saveClick',
      data: {
        openid: openid,
        nid: nid,
        pic: pic,
        nickname: nickname
      },
      method: 'GET',
      success: function (res) {
        //console.log(res)
        if (res.data.code == 200) {
          if (!is_goods) {
            that.setData({ isActive: true, is_good: true });
            setTimeout(() => {
              that.setData({ isActive: false});
            }, 1000)
            wx.showToast({
              title: '点赞成功！',
              icon: 'success',
              duration: 2000
            });
            var numm = ++click
            that.setData({
              click: numm
            });
          }
        } else {
          wx.showModal({
            showCancel: false,
            content: res.data.message
          })
        }
      }
    })
  },

  onShareAppMessage: function () {

  }
})