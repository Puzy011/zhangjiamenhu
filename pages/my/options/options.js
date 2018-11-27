// pages/my/options/options.js
const app = getApp()
var img = app.globalData.img
var openid = ''
var i = 0
var arr = []
var radiov = ''
var radiovs = ''
var openid = ''
var Subscript = ''
var allid = []
var phone = ''
var phones = ''
var numbers = ''
var owner = ''
var folk = ''
var lessee = ''
var nickname = ''
var pic = ''
var lingling = ''
var renzheng = ''
var auth = ''
var value = ''
var day=''
var residential_namelist = ['浅水湾畔', '大洋山庄', '文园雅阁1栋', '文园雅阁2栋', '文园雅阁3栋', '文园雅阁4栋']
Page({
  data: {
    img: img,
    userInfo: {},
    phone: '',
    Name: '',
    Floor: '',
    userID: '',
    Rank: '',
    residential_name: '请选择绑定小区',
    name: '请选择绑定小区',
    userInfo: {},
    img: img,
    userInfo: {},
    subMenuDisplay: initSubMenuDisplay(),
    inputclass: 'weui-input',
    tip: '',
    identi: '',
    selected: false,
    selected1: false,
    selected2: false,
    cellnumber: '',
    yanzheng: '',
    second: 60,
    yzm: true,
    owner: '',
    folk: '',
    lessee: '',
    yrz:true,
  },

  onLoad: function (e) {
    //console.log(app.globalData.auth)
    var that = this
    wx.setStorage({
      key: 'iden',
      data: e.id,
    })
    if (e.id == 0) {
      this.setData({
        identi: '我是业主身份',
        selected: true,
        selected2: false,
        selected1: false,
        owner: 'yezhu'
      })
    } else if (e.id == 1) {
      this.setData({
        identi: '我是租户身份',
        selected: false,
        selected2: true,
        selected1: false,
        lessee: 'zuhu'
      })
    } else if (e.id == 2) {
      this.setData({
        identi: '我是家人身份',
        selected: false,
        selected2: false,
        selected1: true,
        folk: 'jiaren'
      })
    }
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
              that.setData({
                phone: res.data.data[0].phone,
                Name: res.data.data[0].name,
                Floor: res.data.data[0].floor,
                userID: res.data.data[0].household,
                residential_name: res.data.data[0].residential_name,
                display: res.data.data[0].authentication,
                Rank: res.data.data[0].idcard,
                lingling: res.data.data[0].lingling_id,
              })
              app.globalData.residential_id= res.data.data[0].residential_id
              console.log(app)
            }
          }
        })
        wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Article/geteMemberRes',
          data: {
            openid: openid,
          },
          method: 'GET',
          success: function (res) {
            //console.log('data', res.data.data)
            that.setData({
              auth: res.data.data.auth
            })
          }
        })
        wx.request({
          url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/member/validateUserStatus',
          data: {
            openid: openid,
          },
          method: 'GET',
          success: function (res) {
            if (res.data.data == 1) {
              wx.showModal({
                title: '您已提交',
                content: '请耐心等候物业进行认证',
                showCancel: false
              })
            }
          }
        })
      }
    })
    app.getUserInfo(function (userInfo) {
      pic = userInfo.avatarUrl,
        nickname = userInfo.nickName,
        that.setData({
          userInfo: userInfo,
          pic: userInfo.avatarUrl,
          nickname: userInfo.nickName,
        })
    })
  },

  Name: function (e) {
    var value = e.detail.value;
    var regNum = new RegExp('^([a-zA-Z\u4e00-\u9fa5\·\.]{1,10})$');  
    var res = regNum.exec(value);
    if (!res) {
      this.setData({
        tip: '输入真实姓名!'
      })
    } else {
      this.setData({
        tip: ''
      })
    }
    this.setData({
      Name: value
    })
  },

  phone: function (e) {
    var value = e.detail.value;
    var regNum = new RegExp('(^1[3|4|5|7|8][0-9]{9}$)', 'g');
    var res = regNum.exec(value);
    if (!res) {
      this.setData({
        tip: '手机号码格式不正确!'
      })
    } else {
      this.setData({
        tip: ''
      })
    }
    this.setData({
      phone: value
    })
  },

  Rank: function (e) {
    var value = e.detail.value;
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(value))) {
      this.setData({
        tip: '身份号码格式不正确!'
      })
    } else {
      this.setData({
        tip: ''
      })
    }
    this.setData({
      Rank: value
    })
  },

  tapMainMenu: function (e) {
    var that = this
    var index = parseInt(e.currentTarget.dataset.index); 
    var newSubMenuDisplay = initSubMenuDisplay();
    if (this.data.subMenuDisplay[index] == 'hidden') {
      newSubMenuDisplay[index] = 'show';
      that.setData({
        inputclass: 'weui-input-up'
      })
    } else {
      newSubMenuDisplay[index] = 'hidden';
      that.setData({
        inputclass: 'weui-input'
      })
    }
    console.log(newSubMenuDisplay)
    this.setData({
      subMenuDisplay: newSubMenuDisplay
    });
  },

  radioChange: function (e) {
    var value = e.detail.value
    if (value == "qianshui") {
      var box = "浅水湾畔"
    }
    if (value == "dayang") {
      var box = "大洋山庄"
    }
    if (value == "wenyuana") {
      var box = "文园雅阁1栋"
    }
    if (value == "wenyuanb") {
      var box = "文园雅阁2栋"
    }
    if (value == "wenyuanc") {
      var box = "文园雅阁3栋"
    }
    if (value == "wenyuand") {
      var box = "文园雅阁4栋"
    }
    day=box
    this.setData({
      residential_name: box
    })
  },

  Floor: function (e) {
    var value = e.detail.value;
    var regNum = new RegExp('/^[a-zA-Z0-9_\.]+$/');
    var res = regNum.exec(value);
    this.setData({
      Floor: value
    })
  },
  userID: function (e) {
    var value = e.detail.value;
    var regNum = new RegExp('/^[a-zA-Z0-9_\.]+$/');
    var res = regNum.exec(value);
    this.setData({
      userID: value
    })
  },

  cellnumber: function (e) {
    phones = e.detail.value;
  },

  Getkeys: function (e) {
    var that = this
    var phone = this.data.phone
    wx.getStorage({
      key: 'jsopenid',
      success: function (res) {
        openid = res.data
        if (phones == '') {
          wx.showModal({
            content: '请输入手机号码'
          })
        } else {
          //console.log(openid)
          //console.log(phone)
          //console.log(phones)
          wx.request({
            url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/member/smsbaoYezhu',
            data: {
              openid: openid,
              mphone: phones, //业主手机号
              vphone: phone, //家人，租户自己手机号
            },
            method: 'GET', 
            success: function (res) {
              console.log(res)
              if (res.data.code != 200) {
                wx.showModal({
                  title: '获取验证码失败',
                  showCancel: false,
                  duration: 2000
                })
              } else {
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000
                })
                //获取倒计时
                that.setData({
                  yzm: false
                });
                countdown(that);
              }
            }
          })
        }
      }
    })
  },

  sendMessage: function (e) {
    numbers = e.detail.value;
  },
  itemTo: function () {
    wx.navigateTo({
      url: '/pages/my/options/item/item'
    })
  },


  Getkey: function (e) {
    var that = this
    var phone = this.data.phone //租户、家人的手机号
    var name = this.data.Name //姓名
    wx.getStorage({
      key: 'iden',
      success: function (res) {
        var ident = res.data
        wx.getStorage({
          key: 'jsopenid',
          success: function (res) {
            openid = res.data
            if (phones == '') {
              wx.showModal({
                content: '请输入业主手机号码'
              })
            } else {
              //console.log('家人，租户自己手机号', phone)
              //console.log('业主手机号', phones)
              wx.request({
                url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/member/smsbao',
                data: {
                  openid: openid,
                  mphone: phones, //业主手机号
                  vphone: phone, //家人，租户自己手机号
                  name: name,
                  type: ident
                },
                method: 'GET',
                success: function (res) {
                  //console.log(res)
                  if (res.data.code != 200) {
                    wx.showModal({
                      content: res.data.message,
                      title: '获取验证码失败',
                      duration: 2000
                    })
                  } else {
                    wx.showToast({
                      content: res.data.message,
                    })
                    //获取倒计时
                    that.setData({
                      yzm: false
                    });
                    countdown(that);
                  }
                }
              })
            }
          }
        })
      }
    })
  },

  buttonTo: function (e) {
    var that = this
    //console.log('提交data:', this.data)
    var phone = this.data.phone //租户、家人的手机号
    var username = this.data.Name //姓名3
    var Floor = this.data.Floor //楼号
    var userid = this.data.userID //户号
    var allrank = this.data.Rank //身份证号码  
    wx.getStorage({
      key: 'iden',
      success: function (res) {
        //console.log('ident身份', res.data)
        var ident = res.data
        wx.getStorage({
          key: 'jsopenid',
          success: function (res) {
            openid = res.data
            if (ident == 2) {
              //console.log('2家人', ident);
              if (phones == '') {
                wx.showModal({
                  content: '请输入业主手机号',
                  showCancel: false
                })
              } else if (numbers == '') {
                wx.showModal({
                  content: '请输入验证码',
                  showCancel: false
                })
              } else {
                wx.request({
                  url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/article/memberAuthentication',
                  data: {
                    openid: openid,
                    mphone: phones, //业主手机号
                    vphone: phone, //家人，租户自己手机号
                    name: username,
                    floor: Floor,
                    household: userid,
                    idcard: allrank,
                    rid: day,
                    type: 2,
                    number: numbers,
                    form_id: e.detail.formId
                  },
                  method: 'GET',
                  success: function (res) {
                    //console.log('提交认证：', res)
                    if (res.data.code == 200) {
                      wx.request({
                        url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Article/postMemberStatus',
                        data: {
                          openid: openid,
                          type: 2
                        },
                        method: 'GET',
                        success: function (res) {
                          //console.log('回调认证：', res)
                          if (res.data.code == 200) {
                            wx.showModal({
                              content: '(❁´◡`❁)*恭喜您认证成功！',
                              showCancel: false,
                              success: function (res) {
                                if (res.confirm) {
                                  wx.showLoading({
                                    title: '加载中',
                                    mask: true,
                                  })
                                  setTimeout(function () {
                                    wx.reLaunch({
                                      url: '../../index/index',
                                    })
                                    wx.hideLoading()
                                  }, 2000)
                                }
                              }
                            })
                          } else {
                            wx.showModal({
                              content: 'o(╥﹏╥)o认证失败！',
                              showCancel: false,
                              success: function () {
                                wx.showLoading({
                                  title: '加载中',
                                  mask: true,
                                })
                                setTimeout(function () {
                                  wx.reLaunch({
                                    url: '../../index/index',
                                  })
                                  wx.hideLoading()
                                }, 2000)
                              }
                            })
                          }
                        }
                      })
                    } else if (res.data.code == 401) {
                      //401 信息填写不完整
                      // 402 实名认证不通过
                      // 403 该楼户业主已被认证
                      wx.showModal({
                        content: '~~o(>_ <)o ~~信息填写不完整！',
                        showCancel: false,
                        success: function () {
                          wx.showLoading({
                            title: '加载中',
                            mask: true,
                          })
                          setTimeout(function () {
                            wx.reLaunch({
                              url: '../../index/index',
                            })
                            wx.hideLoading()
                          }, 2000)

                        }
                      })
                    } else if (res.data.code == 402) {
                      wx.showModal({
                        content: 'o(╥﹏╥)o实名认证不通过！',
                        showCancel: false,
                        success: function () {
                          wx.showLoading({
                            title: '加载中',
                            mask: true,
                          })
                          setTimeout(function () {
                            wx.reLaunch({
                              url: '../../index/index',
                            })
                            wx.hideLoading()
                          }, 2000)

                        }
                      })
                    } else if (res.data.code == 403) {
                      wx.showModal({
                        content: ' (＃ﾟдﾟﾒ) 该楼户业主已被认证！',
                        showCancel: false,
                        success: function () {
                          wx.showLoading({
                            title: '加载中',
                            mask: true,
                          })
                          setTimeout(function () {
                            wx.reLaunch({
                              url: '../../index/index',
                            })
                            wx.hideLoading()
                          }, 2000)

                        }
                      })
                    }
                  }
                })
              }
            } else if (ident == 1) {
              //console.log('1租户', ident);
              if (phones == '') {
                wx.showModal({
                  content: '请输入业主手机号',
                  showCancel: false
                })
              } else if (numbers == '') {
                wx.showModal({
                  content: '请输入验证码',
                  showCancel: false
                })
              } else {
                wx.request({
                  url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/article/memberAuthentication',
                  //url: 'https:',
                  data: {
                    openid: openid,
                    mphone: phones, //业主手机号
                    vphone: phone, //家人，租户自己手机号
                    name: username,
                    floor: Floor,
                    household: userid,
                    idcard: allrank,
                    rid: day,
                    type: 1,
                    number: numbers,
                    form_id: e.detail.formId
                  },
                  method: 'GET',
                  success: function (res) {
                    //console.log('提交认证：', res)
                    if (res.data.code == 200) {
                      wx.request({
                        url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/Article/postMemberStatus',
                        data: {
                          openid: openid,
                          type: 1
                        },
                        method: 'GET',
                        success: function (res) {
                          //console.log('回调认证：', res)
                          if (res.data.code == 200) {
                            wx.showModal({
                              content: '(◕ᴗ◕✿)恭喜您认证成功！',
                              showCancel: false,
                              success: function (res) {
                                if (res.confirm) {
                                  wx.showLoading({
                                    title: '加载中',
                                    mask: true,
                                  })
                                  setTimeout(function () {
                                    wx.reLaunch({
                                      url: '../../index/index',
                                    })
                                    wx.hideLoading()
                                  }, 2000)
                                }
                              }
                            })
                          } else {
                            wx.showModal({
                              content: '(ಥ﹏ಥ) 认证失败！',
                              showCancel: false,
                              success: function () {
                                wx.showLoading({
                                  title: '加载中',
                                  mask: true,
                                })
                                setTimeout(function () {
                                  wx.reLaunch({
                                    url: '../../index/index',
                                  })
                                  wx.hideLoading()
                                }, 2000)
                              }
                            })
                          }
                        }
                      })
                    } else if (res.data.code == 401) {
                      //401 信息填写不完整
                      // 402 实名认证不通过
                      // 403 该楼户业主已被认证
                      wx.showModal({
                        content: 'o(╥﹏╥)o信息填写不完整！',
                        showCancel: false,
                        success: function () {
                          wx.showLoading({
                            title: '加载中',
                            mask: true,
                          })
                          setTimeout(function () {
                            wx.reLaunch({
                              url: '../../index/index',
                            })
                            wx.hideLoading()
                          }, 2000)

                        }
                      })
                    } else if (res.data.code == 402) {
                      wx.showModal({
                        content: '(´థ౪థ)σ实名认证不通过！',
                        showCancel: false,
                        success: function () {
                          wx.showLoading({
                            title: '加载中',
                            mask: true,
                          })
                          setTimeout(function () {
                            wx.reLaunch({
                              url: '../../index/index',
                            })
                            wx.hideLoading()
                          }, 2000)

                        }
                      })
                    } else if (res.data.code == 403) {
                      wx.showModal({
                        content: '/(ㄒoㄒ)/~~该楼户业主已被认证！',
                        showCancel: false,
                        success: function () {
                          wx.showLoading({
                            title: '加载中',
                            mask: true,
                          })
                          setTimeout(function () {
                            wx.reLaunch({
                              url: '../../index/index',
                            })
                            wx.hideLoading()
                          }, 2000)
                        }
                      })
                    }
                  }
                })
              }
            } else if (ident == 0) {
              if (phone == '') {
                wx.showModal({
                  content: '请输入您的手机号码',
                  showCancel: false
                })
              } else if (username == '') {
                wx.showModal({
                  content: '请输入您的名字',
                  showCancel: false
                })
              } else if (Floor == '') {
                wx.showModal({
                  content: '请输入您的楼号',
                  showCancel: false
                })
              } else if (userid == '') {
                wx.showModal({
                  content: '请输入您的户号',
                  showCancel: false
                })
              } else if (day == '') {
                wx.showModal({
                  content: '请重新选择小区',
                  showCancel: false
                })
              } else if (allrank == '') {
                wx.showModal({
                  content: '请输入您身份证号',
                  showCancel: false
                })
              } else if (numbers == '') {
                wx.showModal({
                  content: '请输入验证码',
                  showCancel: false
                })
              } else {
                /*console.log('openid', openid)
                console.log('phone', phone)
                console.log('username', username)
                console.log('Floor', Floor)
                console.log('userid', userid)
                console.log('allrank', allrank)
                console.log('day', day)
                console.log('nickname', nickname)
                console.log('pic', pic)
                console.log('numbers', numbers)*/
                wx.request({
                  url: 'https://www.zhangjiamenhu.com/apiapp.php?s=apiapp/article/memberAuthentication',
                  data: {
                    openid: openid,
                    mphone: phones, //业主手机号
                    vphone: phone, //家人，租户自己手机号
                    name: username,
                    floor: Floor,
                    household: userid,
                    idcard: allrank,
                    rid: day,
                    type: 0,
                    number: numbers,
                    form_id: e.detail.formId
                  },
                  method: 'GET',
                  success: function (res) {
                    //console.log('bangding:', res)
                    if (res.data.code == 401) {
                      //401 信息填写不完整
                      // 402 实名认证不通过
                      // 403 该楼户业主已被认证
                      wx.showModal({
                        content: '(˘•ω•˘)信息填写不完整！',
                        showCancel: false,
                        success: function () {
                          wx.showLoading({
                            title: '加载中',
                            mask: true,
                          })
                          setTimeout(function () {
                            wx.reLaunch({
                              url: '../../index/index',
                            })
                            wx.hideLoading()
                          }, 2000)

                        }
                      })
                    } else if (res.data.code == 402) {
                      wx.showModal({
                        content: 'o(╥﹏╥)o实名认证不通过！',
                        showCancel: false,
                        success: function () {
                          wx.showLoading({
                            title: '加载中',
                            mask: true,
                          })
                          setTimeout(function () {
                            wx.reLaunch({
                              url: '../../index/index',
                            })
                            wx.hideLoading()
                          }, 2000)

                        }
                      })
                    } else if (res.data.code == 403) {
                      wx.showModal({
                        content: '(｡•́︿•̀｡)该楼户业主已被认证！',
                        showCancel: false,
                        success: function () {
                          wx.showLoading({
                            title: '加载中',
                            mask: true,
                          })
                          setTimeout(function () {
                            wx.reLaunch({
                              url: '../../index/index',
                            })
                            wx.hideLoading()
                          }, 2000)

                        }
                      })
                    } else if (res.data.code == 200) {
                      /* that.setData({
                        kaisuotp:img+"xianshi_off2.png",
                        state:"如您已搬离小区,请及时更换！"
                        });*/
                      wx.showModal({
                        content: 'ヾ(◍°∇°◍)ﾉﾞ提交认证成功！',
                        duration: 2000,
                        showCancel: false,
                        success: function () {
                          wx.showLoading({
                            title: '加载中',
                            mask: true,
                          })
                          setTimeout(function () {
                            wx.reLaunch({
                              url: '../../index/index',
                            })
                            wx.hideLoading()
                          }, 2000)
                        }
                      })
                    }
                  }
                })
              }
            }
          }
        })
      },
    })
  },



  /*
  //点击未合作小区时触发
  nocooperation: function () {
    //radiov = nocooperation
    this.setData({
      nocooperation: true
    })
    //跳转至新的页面
    wx.navigateTo({
      url: 'nocooperation/nocooperation',
      success: function (res) {
        console.log('跳转成功')
      },
      fail: function () {
        console.log('跳转失败')
      }
    })
  },*/
})

//验证码 计时器
function countdown(that) {
  var second = that.data.second;
  if (second == 0) {
    that.setData({
      selected: false,
      selected1: true,
      second: 60,
      yzm: true
    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }, 1000)
}

function initSubMenuDisplay() {
  return ['hidden', 'hidden', 'hidden'];
}