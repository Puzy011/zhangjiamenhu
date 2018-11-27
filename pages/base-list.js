import _ from '../../utils/underscore';
import requestUtil from '../../utils/requestUtil';
import util from '../../utils/util';
import listener from '../../utils/listener';
import urls from 'urls';

/**
 * 列表基础页
 */
module.exports = {

    /** 
     * 数据源
     */
    data: {

        /** 
         * 评论参数
         */
        comment: {
            placeholder: null,
            param: {},
        }
    },

    /**
     * 监听器列表
     */
    listeners: {

        /**
         * 添加新的信息时
         */
        'severs.info.add'() {
            this.onPullDownRefresh();
        },

        /** 
         * 当信息数据改变时
         */
        'severs.info.update'(item) {
            const data = this.data.data, itemTemp = _.find(data, (itemTemp) => { return item.id == itemTemp.id; });
            if (itemTemp === undefined) return;

            _.extend(itemTemp, item);
            this.setData({ data: data });
        },

        /** 
         * 当信息删除时
         */
        'severs.info.delete'(id) {
            const data = this.data.data, index = _.findIndex(data, (itemTemp) => { return id == itemTemp.id; });
            if (index === undefined) return;

            data.splice(index, 1);
            this.setData({ data: data });
        },

        /** 
         * 当用户被拉黑时
         */
        'severs.info.pullblack'(uid) {
            const data = this.data.data;
            for (var i = 0; i < data.length; i++) {
                if (data[i].uid == uid) {
                    data.splice(i, 1);
                    i--;
                }
            }
            this.setData({ data: data });
        }
    },

    /**
    * 设置数据
    */
    onSetData(data, page) {
        data = data || [];
        this.setData({
            page: page !== undefined ? page : this.data.page,
            data: page === 1 || page === undefined ? data : this.data.data.concat(data),
            hasMore: page !== undefined && data.length >= 20,
            isEmpty: page === 1 || page === undefined ? data.length === 0 : false,
            isLoaded: true,
        });
    },

    /**
    * 加载分享数据
    */
    loadShareData() {
        if (wx.showShareMenu) wx.hideShareMenu();
        requestUtil.get(urls.share, { mmodule: 'duoguan_info' }, (info) => {
            this.shareInfo = info;
            if (wx.showShareMenu) wx.showShareMenu();
        });
    },

    /**
     * 注册相关事件
     */
    registerListeners() {
        for (const key in this.listeners) listener.addEventListener(key, this.listeners[key].bind(this));
    },

    /**
     * 卸载相关事件
     */
    unRegisterListeners() {
        for (const key in this.listeners) listener.removeEventListener(key, this.listeners[key]);
    },

    /**
     * 拨打电话
     */
    onCallTap(e) {
        const dataset = e.currentTarget.dataset, mobile = dataset.mobile;

        wx.makePhoneCall({ phoneNumber: mobile, });
    },

    /**
     * 跳转页面
     */
    onNavigateTap(e) {
        const dataset = e.currentTarget.dataset, url = dataset.url, type = dataset.type, nav = { url: url };
        if (dataset.invalid) return;
        if ("switch" == type) {
            nav.fail = function () {
                wx.navigateTo({ url: url });
            };
            wx.switchTab(nav);
        } else {
            wx.navigateTo(nav);
        }

    },

    /**
     * 预览视图
     */
    onPreviewTap(e) {
        let dataset = e.target.dataset, index = dataset.index, url = dataset.url;
        if (index === undefined && url === undefined) return;

        let urls = e.currentTarget.dataset.urls;
        urls = urls === undefined ? [] : urls;
        if (index !== undefined && !url) url = urls[index];
        wx.previewImage({ current: url, urls: urls });
    },

    /**
     * 赞
     */
    onGoodTap(e) {
        if (requestUtil.isLoading(this.goodRQId)) return;
        const dataset = e.currentTarget.dataset, id = dataset.id, index = dataset.index;

        this.goodRQId = requestUtil.get(urls.document.good, { id: id, ver: urls.version }, (res) => {
            const data = this.data.data;
            data[index].is_good = !data[index].is_good;
            data[index].good = res;
            this.setData({ data: data });
        });
    },

    /**
     * 显示评论框
     */
    onShowCommentTap(e) {
        if (requestUtil.isLoading(this.commentRQId)) return;

        const dataset = e.target.dataset;
        const values = {
            index: e.currentTarget.dataset.index,
            comment_index: dataset.commentIndex,
            reply_id: dataset.replyId,
            reply_uid: dataset.uid,
            doc_id: dataset.docId,
        };
        console.log(values);
        if (!values.reply_id && !values.doc_id) return;

        const comment = {
            param: values,
            placeholder: (values.reply_id ? "回复 " : "评论 ") + dataset.nickname,
            show: true
        };
        this.setData({ comment });
    },

    /**
     * 隐藏评论框
     */
    onHideCommentTap() {
        this.setData({ comment: false });
    },

    /**
     * 提交评论
     */
    onCommentSubmit(e) {
        const values = _.extend({
            form_id: e.detail.formId,
            ver: urls.version
        }, e.detail.value, this.data.comment.param);

        console.log(values);
        this.commentRQId = requestUtil.post(urls.comment.add, values, (info) => {
            const data = this.data.data;
            if (values.reply_id) {
                //回复
                data[values.index].comment_list[values.comment_index].reply_list.push(info);
                data[values.index].comment_list[values.comment_index].reply_count++;
            } else {
                //评论
                info.reply_list = [];
                data[values.index].comment_list.push(info);
                data[values.index].comment++;
            }
            this.setData({ data: data, comment: false });
        });
    },

    /**
     * 分享页面
     */
    onShareAppMessage() {
        this.shareInfo = this.shareInfo || {};
        const title = this.shareInfo.title || '';
        const desc = this.shareInfo.desc || '';
        return {
            title: title,
            desc: desc,
            path: 'pages/severs/index/index'
        };
    }
};