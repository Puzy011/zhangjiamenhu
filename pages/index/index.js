//index.js
//获取应用实例
const app = getApp()
var img = app.globalData.img
var i = 0
var title = []
var item = []
var content = []
var idg = ''
var openid = ''
var upsum = 0
var downsum = 0
var type = 1
var nickname = ''
var pic = ''
var money = ''
var allitems= []
var noticeNum= 3
Page({
  data: {
    notices: [],
    img: img,
    userInfo: {},
    titles: '掌家欢迎您',
    textares: '',
    time: '',
    author: '',
    upic: '',
    length: '',
    isVerify:3,
    items:[],
    hasMore:'',
    auth:'',
    show_comment:false,
    thisid:'',
    etc_url:""
	},

	//下拉刷新
	onPullDownRefresh: function (e) {
		var that = this;
		wx.showNavigationBarLoading() //在标题栏中显示加载
		//模拟加载
		setTimeout(function () {
			//console.log("刷新")
			that.onLoad()
			wx.hideNavigationBarLoading() //完成停止加载
			wx.stopPullDownRefresh() //停止下拉刷新
		}, 2000);

	},

  onReachBottom: function () {
    noticeNum+=3
    this.setData({
      items: allitems.slice(0, (noticeNum >= allitems.length ? allitems.length : noticeNum))
    })
    if (noticeNum >=allitems.length) {
      this.setData({
        hasMore: true
      })
    } else {
      this.setData({
        hasMore: false
      })
    } 
    //console.log(this.data.items)
  },

  onLoad: function () {
		//console.log('page.onLoad')
    var that = this
		app.getUserInfo(function (userInfo) {
			//更新数据
      //console.log(userInfo)
			pic = userInfo.avatarUrl
			nickname = userInfo.nickName
			that.setData({
				userInfo: userInfo
      })
		})

    setTimeout(function(){
      app.getVerified(function (verifyInfo) {
        //console.log(verifyInfo)
        that.setData({
          isVerify: verifyInfo,
        })
        if (verifyInfo == 0) {a
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
        } else if (verifyInfo == 1) {
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
        else if (verifyInfo == 2) {
          wx.getStorage({
            key: 'jsopenid',
            success: function (res) {
              console.log(res)
              var openid = res.data
              wx.request({
                url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Article/geteMemberRes',
                data: {
                  openid: openid,
                },
                method: 'GET',
                success: function (res) {
                  //console.log(res)
                  //console.log('1未通过2通过,类型auth', res.data.data.auth)
                  app.globalData.auth = res.data.data.auth
                  app.globalData.membertype = res.data.data.type
                  app.globalData.membertype1 = res.data.data.type1
                  app.globalData.membertype2 = res.data.data.type2
                  if (res.data.data.auth == 2) {
                    //获取资讯显示
                    wx.request({
                      url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Neighborhood/getNeighborhoodList',
                      data: {
                        openid: openid,
                      },
                      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                      // header: {}, // 设置请求的 header
                      success: function (res) {
                        //console.log(res)
                        item = res.data.data
                        //console.log(item)
                        allitems = item
                        //邻里圈
                        that.setData({
                          items: allitems.slice(0, (noticeNum >= allitems.length ? allitems.length : noticeNum))
                        })
                        //console.log(that.data.items)
                        if (noticeNum >= allitems.length) {
                          that.setData({
                            hasMore: true
                          })
                        } else {
                          that.setData({
                            hasMore: false
                          })
                        }
                      }
                    })
                    app.getNotice(function (noticeInfo) {
                      //资讯信息
                      console.log(noticeInfo)
                      var noticedetail = noticeInfo.data
                      for (var i = 0; i < noticedetail.length; i++) {
                        console.log(noticedetail[i].content)
                          // noticedetail[i].content = noticedetail[i].content.replace(/<p>|<\/p>|<div>|<\/div>/ig, '')
                        //noticedetail[i].content = noticedetail[i].content[0].data.replace(/<p>|<\/p>|<div>|<\/div>/ig, '')
                        console.log(noticedetail[i])
                      }
                      var title = noticedetail[0].title
                      var length = noticedetail.length
                      var textare = noticedetail[0].content
                      var author = noticedetail[0].author
                      var time = noticedetail[0].time
                      if (noticeInfo.code == 200) {
                        that.setData({
                          notices: noticedetail,
                          titles: title,
                          textares: textare,
                          author: author,
                          time: time,
                          length: length,
                          auth: app.globalData.auth,
                        })
                        if (author == 'qswp') {
                          //console.log('浅水湾畔')
                          that.setData({
                            author: '浅水湾畔',
                          })
                        }
                      }
                    })
                  } else {
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
                  }
                }
              })

            }
          })
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
                    if (residential_id=="7"){
                      that.setData({
                        etc_url:"caller/caller"
                      })
                    }
                    // 文园雅阁
                    // if (residential_id == 13 || residential_id == 14 || residential_id == 15 || residential_id == 16) {
                    //   that.setData({
                    //     etc_url: "callera/callera"
                    //   })
                    // }
                    // // 文园雅阁
                    if(residential_id == 13 || residential_id == 14 || residential_id == 15 || residential_id==16){
                      that.setData({
                        etc_url: "callera/callera"
                      })
                    }
                  }
                }
              })
            }
          })
        }
      })
    },1000)
	},

  //跳转页面
  onNavigateTap(e) {
    const dataset = e.currentTarget.dataset, url = dataset.url, notice = dataset.notice, nav = { url: url + '?notice=' + JSON.stringify(notice) };
    if (this.data.isVerify == 0) {
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
    } else if (this.data.isVerify == 1) {
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
    }else{
      if (app.globalData.auth==2){
        wx.navigateTo(nav);
      } else {
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
      }
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

  //分享功能
  onShareAppMessage: function () {
    //console.log(this.data.title)
    return {
      title: '掌家门户为您服务',
      path: "pages/index/index",
      success: function (res) {
        // 分享成功
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function (res) {
        // 分享失败
        wx.showModal({
          showCancel: false,
          title: '分享失败'
        })
      }
    }
  },

  /* 显示评论框*/
  onShowCommentTap(e) {
    this.setData({ 
      show_comment: true,
      thisid: e.currentTarget.dataset.thisid
       });
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
    var id = this.data.thisid
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
        //console.log(res)
        if (res.data.code != 200) {
          wx.showModal({
            showCancel: false,
            content: res.data.message
          })
          //that.tapMainMenu();
        } else {
          wx.showToast({
            title: '已评论',
            icon: 'success',
            duration: 3000
          });
          for(var o=0;o<that.data.items.length;o++){
            if (that.data.items[o].id == id) {
              that.data.items[o].number++
            }
          }
          that.setData({
            show_comment: false,
            items: that.data.items
          });
          //that.tapMainMenu();
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
        id: that.data.thisid
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
  /*onGoodTap: function (e) {
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
              that.setData({ isActive: false });
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


  //事件处理函数
  /*identTo: function () {
    wx.navigateTo({
      url: '../ident/ident'
    })
  },*/
  /*bindViewOpen: function () {
    wx.navigateTo({
      // url: '../open/open'
      url: '../pay/pay'
    })
  },*/

  //扫码，扫一扫
  /*saoma: function () {
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        //console.log(res)
      }
    })
  },*/
  
})