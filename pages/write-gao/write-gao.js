// import _ from '../../utils/underscore';
// import requestUtil from '../../utils/requestUtil';
// import util from '../../utils/util';
// import listener from '../../utils/listener';
// import urls from '../urls';

Page({
    /**
     * 分类ID
     */
	cid: 0,

    /**
     * 已上传的文件列表
     */
	uploadedFiles: [],

    /**
     * 已上传的文件状态列表
     */
	uploadedFilesState: {},

    /**
     * 数据源
     */
	data: {
		pictures: [],
		disableBtnPush: true,
		isShowStatementTap: false,
		tagActive: false,
	},

    /**
     * 页面被加载
     */
	onLoad(options) {
		this.setData({
			options: options
		});

		this.cid = options.cid;
		this.title = options.title;
		if (this.title) {
			wx.setNavigationBarTitle({ title: this.title + ' - 发布' });
		}

		// if (!this.cid || this.cid < 0) {
		// 	wx.showModal({
		// 		title: '错误提示',
		// 		content: '非法打开页面，请退出后重试~',
		// 		showCancel: false,
		// 		success(res) {
		// 			wx.navigateBack();
		// 		},
		// 	});
		// 	return;
		// }

		//获取位置信息
		wx.getLocation({
			success: (res) => {
				util.getMapSdk().reverseGeocoder({
					location: {
						latitude: res.latitude,
						longitude: res.longitude
					},
					success: (res) => {
						res = res.result;
						this.setData({
							address: res.address,
							latitude: res.location.lat,
							longitude: res.location.lng
						});
					}
				});
			},
		});

		this.setData({ mobile: wx.getStorageSync('servers_mobile') });
		this.loadConfig();
	},

    /**
     * 加载配置数据
     */
	loadConfig(callback) {
		requestUtil.get(urls.config.load, { name: 'config,category,show_mcard', cid: this.cid }, (data) => {
			const { config, category, show_mcard } = data;
			wx.setStorageSync('servers_config', config);

			const info = {};
			if (config.top_rule.length) {
				const rule = config.top_rule[0];
				info.top_day = rule.day;
				info.top_amount = rule.amount;
			}

			category.tags = _.map(category.tags, (item) => { return { active: false, value: item } });

			this.setData(_.extend({ config, cate: category, show_mcard, disableBtnPush: false }, info));
		});
	},

    /**
     * 打开地图
     */
	onOpenMapTap(e) {
		wx.chooseLocation({
			success: (res) => {
				this.setData({
					address: res.address, latitude: res.latitude,
					longitude: res.longitude
				});
			}
		});
	},

    /**
     * 打开图片
     */
	onOpenPictureTap(e) {
		wx.chooseImage({
			count: 6 - this.data.pictures.length, success: (res) => {
				const pictures = this.data.pictures.concat(res.tempFilePaths);
				this.setData({ pictures: _.uniq(pictures) });
			}
		});
	},

    /**
     * 预览图片
     */
	onPreviewTap(e) {
		if (this.isDeleteAction) return;
		const dataset = e.currentTarget.dataset, index = dataset.index;
		wx.previewImage({
			current: this.data.pictures[index],
			urls: this.data.pictures,
		});
	},

    /**
     * 删除选择的图片
     */
	onDeleteImgTap(e) {
		this.isDeleteAction = true;
		const dataset = e.currentTarget.dataset, index = dataset.index;
		wx.showActionSheet({
			itemList: ['删除'],
			success: (res) => {
				if (res.tapIndex === 0) {
					const pictures = this.data.pictures, key = this.getFilename(pictures[index]);
					pictures.splice(index, 1);
					delete this.uploadedFilesState[key];
					this.setData({ pictures: this.data.pictures });
				}
			}, complete: () => {
				this.isDeleteAction = false;
			}
		})
	},

    /**
     * 置顶天数已改变
     */
	onTopDayChange(e) {
		const rules = this.data.config.top_rule, index = parseInt(e.detail.value);
		if (rules.length == 0) return;

		this.setData({ top_day: rules[index].day, top_amount: rules[index].amount });
	},

    /**
     * 开启置顶
     */
	onIsTopChange(e) {
		this.setData({ is_top: e.detail.value ? 1 : 0 });
	},

    /**
     * 提交数据
     */
	onPushSubmit(e) {
		if (requestUtil.isLoading(this.pushRQId)) return;

		//尝试同步微信信息
		util.trySyncWechatInfo(() => {

			this.uploadFile(0, (files) => {
				const values = _.extend({ formId: e.detail.formId, cid: this.cid }, files, e.detail.value);

				let tagIndex = 0;
				_.each(this.data.cate.tags, (item) => {
					if (item.active) {
						values['tags[' + tagIndex + ']'] = item.value;
						tagIndex++;
					}
				});

				this.pushRQId = requestUtil.post(urls.document.add, values, (info) => {
					wx.setStorageSync('servers_mobile', values.mobile);
					if (info.status == 0) {
						//是否开启支付
						if (info.is_pay == 1 || info.is_top) {
							this.onPayment(info);
						} else {
							//跳转我的发布
							wx.redirectTo({ url: '../my-lists/my-lists', });
						}
					} else {
						listener.fireEventListener('severs.info.add', [info]);
						wx.switchTab({ url: '../index/index' });
					}
				});
			});

		});

	},

    /**
     * 上传文件
     */
	uploadFile(index, callback) {
		const pictures = this.data.pictures, filepath = pictures[index];
		if (pictures.length === 0) {
			callback.apply(this, this.uploadedFiles);
			return;
		}
		//上传后处理
		const completeAfterHandler = () => {
			if (index >= pictures.length - 1) {
				callback.apply(this, [this.uploadedFiles]);
			} else {
				this.uploadFile(index + 1, callback);
			}
		};
		//这个文件是否已经上传过
		const key = this.getFilename(filepath);
		if (key in this.uploadedFilesState) {
			completeAfterHandler();
		} else {
			this.pushRQId = requestUtil.upload(urls.document.upload, filepath, "file", {}, (res) => {
				this.uploadedFiles['imgs[' + index + ']'] = res;
				this.uploadedFilesState[key] = 1;
			}, this, {
					completeAfter: completeAfterHandler
				});
		}

	},

    /**
     * 获取文件名
     */
	getFilename(filepath) {
		var patt = new RegExp('(.*\/)*([^.]+).*', "gi");
		return patt.exec(filepath)[2];
	},

    /**
     * 支付
     */
	onPayment(info) {
		if (this.data.show_mcard) {
			//显示余额支付
			wx.showActionSheet({
				itemList: ['余额', '微信支付'],
				success: (res) => {
					if (res.tapIndex == 0) {
						const data = this.data, total_amount = parseFloat(data.cate.amount) + (data.is_top ? parseFloat(data.top_amount) : 0);
						util.payment({
							id: info.id,
							total_amount: total_amount,
							notify_url: urls.document.payment,
						}, (res) => {
							if (res.code != 1) {
								wx.redirectTo({ url: '../my-lists/my-lists', });
							} else {
								listener.fireEventListener('severs.info.add', [info]);
								wx.switchTab({ url: '../index/index' });
							}
						});
					} else if (res.tapIndex == 1) {
						//微信支付
						this.onWechatPayment(info);
					}
				}, fail: () => {
					//跳转我的发布
					wx.redirectTo({ url: '../my-lists/my-lists', });
				}
			});
		} else {
			//直接微信支付
			this.onWechatPayment(info);
		}
	},

    /**
     * 微信付款
     */
	onWechatPayment(docInfo) {
		requestUtil.get(urls.document.pay, { id: docInfo.id }, (info) => {
			const handler = () => {
				docInfo.is_pay = 2;
				docInfo.status = 1;
				listener.fireEventListener('severs.info.update', [docInfo]);

				wx.showToast({ title: '已审核通过...', icon: 'success' });
				wx.switchTab({ url: '../index/index' });
			};

			if (info === 1) {
				handler();
			} else {
				wx.requestPayment(_.extend(info, {
					success: handler,
					fail: () => {
						wx.redirectTo({ url: '../my-lists/my-lists', });
					}
				}));
			}
		}, this, {
				error: () => {
					wx.redirectTo({ url: '../my-lists/my-lists', });
				}
			});
	},

    /**
     * 显示免责声明
     */
	onShowStatementTap() {
		this.setData({ isShowStatementTap: !this.data.isShowStatementTap });
	},

	/**
	 * 选择标签
	 */
	onChooseTag(e) {
		const dataset = e.currentTarget.dataset, index = dataset.index,
			tags = this.data.cate.tags;
		tags[index].active = !tags[index].active;
		this.setData({ cate: this.data.cate });
	}
})