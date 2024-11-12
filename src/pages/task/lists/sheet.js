/*
* @author 友人a丶
* @date 
* 
* */

import api from "@/service/api";
import load from "@/common/util/load";
import system from "@/store/system";
import open from "@/common/sys/open";


export default function (id) {

    const sys = system(); //系统信息


    try {

        load.loading();//加载中

        /* 请求登录接口 */
        uni.request({
            url: `${api.sheet}?box=${id}`,
            method: "GET"
        }).then((res) => {

            /* 如果登录成功！ */
            if (res.data.code) {

                const link = res.data.data;

                /* 收集的在线查看 */
                if (sys.device.isMobile) {

                    uni.downloadFile({
                        url: link,
                        success: (res) => {

                            /* 异常 */
                            if (res.statusCode !== 200) {
                                load.error("文件下载异常，请重新尝试或咨询客服！")
                                return;
                            }

                            /* 如果返回的是json */
                            if (res.header["Content-Type"].indexOf('json') > -1) {
                                /* 请求成功 */
                                load.error(res.data.errMsg)
                            } else {
                                open(res.tempFilePath); //预览文件
                            }

                        },
                        fail: (e) => {
                            load.error(e);
                        },
                        complete() {
                            load.loaded();
                        }
                    });

                } else {
                    load.info("电脑端小程序暂不支持在线查看表格，已自动为您复制下载链接，你可以粘贴到浏览器下载后查看！", () => {
                        uni.setClipboardData({
                            data: link,
                            showToast: false
                        })
                    });
                }

            } else {
                load.error(res.data.errMsg); //弹出错误信息
            }

        }).catch(e => {
            console.log(e);
            load.error(e);
            load.loaded();
        });

    } catch (e) {
        console.log(e)
        load.error(e);
        load.loaded();
    }

}
