/*
* @author 友人a丶
* @date 
* 
* */

import load from "@/common/util/load";
import api from "@/service/api";

export default function (money, info, callback) {

    load.loading("等待支付...");

    try {
        /* 请求登录接口 */
        uni.request({
            url: api.pay,
            method: "POST",
            data: {
                money: money
            }
        }).then((res) => {

            const data = res.data.data;

            /* 如果登录成功！ */
            if (res.data.code) {

                /* 唤起微信支付 */
                wx.requestPayment({
                    timeStamp: data.timeStamp,
                    nonceStr: data.nonceStr,
                    package: data.package,
                    signType: data.signType,
                    paySign: data.paySign,
                    success() {
                        load.info(info, callback)
                    },
                    fail(e) {
                        load.error("支付唤起失败..." + JSON.stringify(e))
                    }
                });

            } else {
                load.error(res.data.errMsg); //弹出错误信息
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
