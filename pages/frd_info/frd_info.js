// pages/severs/frds_nearby.js
const app = getApp();

// import _ from '../../utils/underscore';
// import requestUtil from '../../utils/requestUtil';
// import util from '../../utils/util';
// import listener from '../../utils/listener';
// import baseList from '../base-list';
// import urls from '../urls';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isLoaded: false,//是否已加载过
        isEmpty: false,//数据是否为空
        hasMore: true,//是否还有更多数据
        page: 1,//当前请求的页数
        data: [],
        frdUid: 0,
    },

    /**
     * UID
     */
    

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.frdUid = options.uid;
        // this.registerListeners();

        // //加载缓存的配置信息
        // this.setData({ config: wx.getStorageSync('servers_config') });
        // this.onPullDownRefresh();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        //移除注册的事件
        // this.unRegisterListeners();
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

        // requestUtil.get(urls.document.userDocs, { uid: this.frdUid }, (data, res) => {
        //     wx.setNavigationBarTitle({ title: res.nickname + "的信息" });

        //     this.setData({
        //         info_count: res.info_count,
        //         total_click: res.total_click,
        //         total_good: res.total_good,
        //         nickname: res.nickname,
        //         sex: res.sex,
        //         headimgurl: res.headimgurl,
        //     });
            
        //     this.onDataHandler(data);
        //     this.onSetData(data, 1);
        // }, this, { completeAfter: wx.stopPullDownRefresh });

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (!this.data.hasMore) {
            console.log("没有更多了...");
            wx.stopPullDownRefresh();
            return;
        }

        //加载新数据
        // requestUtil.get(urls.document.userDocs, _.extend({ _p: this.data.page + 1, uid: this.frdUid }, this.data.param), (data) => {
        //     this.onDataHandler(data);
        //     this.onSetData(data, this.data.page + 1);
        // }, this, { completeAfter: wx.stopPullDownRefresh, isShowLoading: false });
    },

    /**
     * 数据处理
     */
    onDataHandler: function (data) {
        _(data).map((item) => {
            item.create_time = util.formatSmartTime(item.create_time * 1000, "yyyy-MM-dd hh:mm");
            return item;
        });
    },

    /**
    * 跳转页面
    */
    onNavigateTap: function (e) {
        const url = e.currentTarget.dataset.url;
        if (url.indexOf("frd_info") != -1) return;
        wx.navigateTo({ url: url });
    },

    /**
     * 分享页面
     */
    onShareAppMessage() {
        const title = this.data.nickname || '同城';
        return {
            title: title,
            path: 'pages/severs/frd_info?uid=' + this.frdUid
        };
    }

});