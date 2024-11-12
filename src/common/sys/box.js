/*
* @author 友人a丶
* @date 
* 
* */

import api from "@/service/api";
import load from "@/common/util/load";
import {ref} from "vue";
import {onLogin} from "@/common/util/event";
import iniSys from "@/store/system";
import {onShow} from "@dcloudio/uni-app";


/**
 * 加载任务信息
 * @param boxId
 * @param type 是否加载统计信息
 * @param refresh
 */
export function loadBox(boxId = null, type, refresh = false) {

    /* 系统设置 */
    const system = iniSys();
    /* 不同的初始化接口 */
    const link = [api.collect, api.shareBox, api.qrcode, api.box, api.next];

    /* 判断有没有传递ID */
    if (!boxId) {
        /* 回首页 */
        load.info("页面跳转异常，请重试", () => {
            uni.switchTab({
                'url': '/pages/index/index/index'
            })
        });

        /* 终止加载 */
        return;
    }

    /* 存放盒子数据 */
    const box = ref(Object.create(null));
    const loaded = ref(false); //是否加载完毕

    /**
     * 加载任务信息
     */
    const loadBox = () => {

        try {
            /* 请求登录接口 */
            uni.request({
                url: `${link[type]}?box=${boxId}`,
                method: "GET",
            }).then((res) => {

                /* 如果登录成功！ */
                if (res.data.code === 1) {

                    box.value = res.data.data;
                    loaded.value = true;//标记加载完毕

                    /* 设置标题 */
                    uni.setNavigationBarTitle({
                        title: res.data.data.title
                    })

                    /* 是否需要关闭广告 */
                    system.setAd(box.value.ad);

                } else {
                    //弹出错误信息
                    load.info(res.data.errMsg, () => {
                        if (res.data.errMsg.indexOf("权限") > -1) {
                            uni.navigateTo({
                                'url': `/pages/collect/upload?id=${boxId}`
                            })
                        } else {
                            uni.switchTab({
                                'url': '/pages/index/index/index'
                            })
                        }
                    });
                }

            }).catch(e => {
                console.log(e);
                load.error(e)
            }).finally(() => {
                load.loaded(0);
            });

        } catch (e) {
            console.log(e)
            load.error(e);
        }

    }

    /**
     * 登录成功时触发
     */
    onLogin(() => {
        load.loading("加载中");
        loadBox();//加载任务信息
    });

    /*
    * 刷新数据
    * */
    if (refresh) {
        onShow(() => {
            if (loaded.value) loadBox();
        })
    }

    return {
        loaded,
        reload: loadBox,
        box
    }
}


/**
 * 分享
 * @param box
 * @param type
 */
export function share(box, type = 1) {


    const link = type === 1 ? api.share : api.sharePermiss;

    try {
        /* 请求登录接口 */
        uni.request({
            url: link + "?box=" + box,
            method: "GET",
        }).then(() => {
            load.success("分享成功！");
        }).catch(e => {
            console.log(e);
            load.error(e)
        })
    } catch (e) {
        console.log(e)
        load.error(e);
    }
}
