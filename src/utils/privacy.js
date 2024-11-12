/*
* @author 友人a丶
* @date 
* 隐私权限校验
* */
import intSys from "@/store/system";
import globalData from "@/store/data";


export default function () {

    /* 系统配置类 */
    const sys = intSys();

    /* 是否可以使用指定的API */
    if (wx.canIUse('getPrivacySetting')) {
        /* 后台静默检查 */
        wx.getPrivacySetting({
            success: res => {
                if (res.needAuthorization) {
                    /* 保存隐私协议 */
                    sys.setPrivacy(res);
                }
            }
        });
    }


    /* 是否可以使用指定的API */
    if (wx.canIUse('onNeedPrivacyAuthorization')) {

        /* 后台静默检查 */
        wx.onNeedPrivacyAuthorization((resolve, eventInfo) => {
            /* 保存隐私协议 */
            sys.setPrivacy({
                needAuthorization: true,
                protocol: "用户隐私协议"
            });

            /* resolve方法 */
            globalData.resolve = resolve;
        });
    }

}
