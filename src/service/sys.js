import iniUser from "@/store/user.js"
import iniSys from "@/store/system";
import api from "@/service/api";
import load from "@/common/util/load.js"

/**
 * 添加全局请求拦截器
 * @returns {any}
 */
function addIntercept() {

    /* 用户信息 */
    const userInfo = iniUser();

    /* 定义拦截器 */
    const request = {
        invoke(args) {
            try {

                /* 如果没有默认请求头 */
                if (!args.header) {
                    args.header = {};
                }

                args.header['Authorization'] = userInfo.token
            } catch (e) {
                console.log(e);
            }

            return args;
        }
    };


    /* 响应拦截器 */
    const response = {
        success(args) {
            if (typeof args.data === 'string') {
                try {
                    args.data = JSON.parse(args.data);
                } catch (e) {
                    args.data = {code: 0, errMsg: "数据解析失败！"};
                }
            }
            return args;
        }
    };

    /* 全局认证头 */
    uni.addInterceptor('request', request);
    uni.addInterceptor('uploadFile', Object.assign(request, response));
}


/**
 * 系统登录接口
 */
export default function login() {

    /* 用户信息 */
    const userInfo = iniUser();
    const system = iniSys();

    return new Promise(resolve => {

        /* 显示加载效果 */
        load.loading("加载中...");

        /* 调用小程序登录接口 */
        uni.login({
            force: true,
            success(res) {

                try {

                    /* 请求登录接口 */
                    uni.request({
                        url: api.login,
                        method: "POST",
                        data: {
                            code: res.code,
                            device: system.device
                        }
                    }).then((res) => {

                        const data = res.data.data;

                        /* 如果登录成功！ */
                        if (res.data.code) {
                            /* 更新用户信息 */
                            userInfo.login(data.user);
                            /* 更新系统配置 */
                            system.setSys({env: data.env, ad: data.ad});
                            /* 更新全局拦截器 */
                            addIntercept();
                            resolve(true); //退出promise
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


            },
            fail(e) {
                load.error(e);
            }
        });

    })
}
