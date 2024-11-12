/**
 * @author 友人a丶
 * @date
 * 注册Vue全局方法
 * */

import intUser from "@/store/user";
import intSys from "@/store/system";

export default function (app) {
    /* 全局绑定用户信息 */
    app.config.globalProperties.$user = intUser();
    /* 全局绑定系统配置 */
    app.config.globalProperties.$sys = intSys();
    /* 跳转函数 */
    app.config.globalProperties.$go = function (type, path = null) {
        if (type === 'redirect') {
            uni.redirectTo({
                url: path
            });
        } else if (type === 'push') {
            uni.navigateTo({
                url: path
            });
        } else if (type === 'tab') {
            uni.switchTab({
                url: path
            });
        } else if (type === 'back') {
            uni.navigateBack();
        }
    }
    /* url编码 */
    app.config.globalProperties.$encode = encodeURIComponent;
}