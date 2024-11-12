/*
* @author 友人a丶
* @date 
* 自定义组件事件
* */


import load from "@/common/util/load";
import user from "@/store/user.js"
import {watch} from "vue";

/**
 * 已登录时触发
 */
export function onLogin(callback) {

    /* 用户信息 */
    const userInfo = user();

    if (userInfo.token) {
        callback();
    } else {
        watch(() => userInfo.token, callback)
    }

}
