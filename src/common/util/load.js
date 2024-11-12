/* 显示uni的各种加载特效 */
let loading = 0; //加载的数量
let timer = null; //定时器


export default {
    /* 显示加载动画 */
    loading(text = "加载中") {

        if (loading === 0) {
            uni.showLoading({
                title: text
            });
        }

        loading++; //弹窗+1
    },
    /* 隐藏加载 */
    loaded(time = 300, callback = null) {

        /* 没有弹窗 */
        if (loading === 0) {
            return;
        }

        if (loading >= 1) {
            loading--; //弹窗减一
        }

        /* 需要关闭弹窗 */
        if (loading === 0) {

            timer = setTimeout(() => {

                uni.hideLoading();
                clearTimeout(timer);

                /* 触发回调 */
                if (callback) {
                    callback()
                }
            }, time);
        }
    },
    /* 成功提示 */
    success: function (text) {

        uni.showToast({
            mask: true,
            icon: "success",
            title: text,
            duration: 2000
        });

    },
    /* 错误提示 */
    error: function (text) {

        uni.hideLoading();
        loading = 0; //重置

        if (typeof text === 'undefined') {
            text = "加载失败...";
        }

        /* 转换对象 */
        if (typeof text === 'object' && text !== null) {
            if (!!text.message) {
                text = text.message;
            } else {
                text = JSON.stringify(text);
            }
        }

        uni.showModal({
            title: '错误提示',
            showCancel: false,
            content: text
        });
    },
    /* 确认框 */
    confirm: function (text, callback = null) {

        uni.hideLoading();
        loading = 0; //重置

        uni.showModal({
            title: '温馨提示',
            content: text,
            success: function (res) {
                if (res.confirm && callback) {
                    callback()
                }
            }
        });
    },
    /* 信息框 */
    info: function (text, callback = null, option = {}) {

        uni.hideLoading();
        loading = 0; //重置

        uni.showModal(Object.assign({
            title: '温馨提示',
            showCancel: false,
            content: text,
            success: function (res) {
                if (callback) {
                    callback(res)
                }
            }
        }, option));
    },
    /* 延时跳转 */
    delay: function (url, time, type = true) {
        /* 跳转回列表 */
        let timer = setTimeout(() => {
            clearTimeout(timer);
            if (type) {
                uni.redirectTo({
                    url: url
                })
            } else {
                uni.switchTab({
                    url: url
                })
            }
        }, time)
    }
}
