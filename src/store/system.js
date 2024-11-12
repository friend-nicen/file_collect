import {defineStore} from 'pinia';

import {ref, watch} from 'vue';
import api from "@/service/api";


const loaded = ref(false); //记录系统信息是否已经加载

const system = defineStore('system', {
    state: () => {

        loaded.value = true; //加载设备

        return {
            device: {
                brand: "", //品牌
                model: "", //型号
                system: "", //操作系统
                isMobile: null, //是不是手机
                screenWidth: 0,
                screenHeight: 0,
            },
            env: {
                /* 小程序名称 */
                title: "",
                /* 首页图标 */
                icon: {
                    /* 图片收纳箱 */
                    image: "",
                    /* 任意文件收纳 */
                    file: "",
                    /* 帮助 */
                    help: "",
                },
                /* 提示 */
                alert: "",
                alert_on_end: "",
                tmp_id_on_end: "",
                /* 是否显示捐赠 */
                donate: false,
                /* 系统公告 */
                board: "",
                /* 系统数字限制配置 */
                number: {
                    /* 名单名称 */
                    listName: 10,
                    /* 规则名称 */
                    itemName: 100,
                    /* 任务标题 */
                    title: 300,
                    /* 任务介绍 */
                    instruction: 600,
                    /* 上传表单 */
                    inputInfo: 30
                },
                /* 各个webview地址 */
                webview: {
                    /* 帮助页地址 */
                    help: "",
                    /* 文件上传的webview地址 */
                    upload: "",
                    /* 更新日志 */
                    update: ""
                },
                /* 用户页面菜单 */
                menu: [],
                /* 最大文件大小 */
                max: 0,
                /* 资源下载域名 */
                cdn: "",
                /* 预览文件的域名 */
                preview: ""
            },
            ad: {
                /* 全局是否展示广告 */
                show: false,
                /* 任务是否展示广告 */
                box: true,
                /* 各个页面的广告配置 */
                config: {
                    /* 激励视频广告ID */
                    prize: {
                        adid: ""
                    },
                    /* 任务界面 */
                    collect: {
                        show: true,
                        type: 1,
                        adid: "",
                        image: ""
                    },
                    /* 准备上传 */
                    preload: {
                        show: true,
                        type: 1,
                        adid: "",
                        image: ""
                    },
                    /* 上传 */
                    upload: {
                        show: true,
                        type: 1,
                        adid: "",
                        image: ""
                    },
                    /* 文件列表 */
                    filelist: {
                        show: true,
                        type: 1,
                        adid: "",
                        image: ""
                    },
                    /* 文件打包 */
                    bundle: {
                        show: true,
                        type: 1,
                        adid: "",
                        image: ""
                    },
                    /* 上传页面的插屏广告 */
                    insert: {
                        show: true,
                        adid: ""
                    }
                }
            },
            /* 隐私协议的配置 */
            privacy: {
                show: false,
                protocol: "",
            }
        };
    },

    actions: {
        /* 保存设备信息 */
        setDevice(device) {
            this.device = device;
        },
        /* 保存隐私信息 */
        setPrivacy(privacy) {
            this.privacy.show = privacy.needAuthorization;
            this.privacy.protocol = privacy.privacyContractName;
        },
        /* 保存环境配置 */
        setSys(sys) {

            /* 基础配置 */
            this.env = sys.env;
            this.ad = sys.ad;

            /* 接口地址 */
            api.cdn = sys.env.cdn;
            api.preview = sys.env.preview;
        },
        /* 关闭广告 */
        setAd(ad) {
            this.ad.box = ad;
        }
    },
});


/* 加载设备信息 */
if (!loaded.value) {

    /* 启动一个监视器 */
    const stopWatch = watch(loaded, () => {

        /* 获取系统信息 */
        uni.getSystemInfo({
            success(res) {

                loaded.value = true; //标记已经下载下次不加载

                /* 保存设备信息 */
                system().setDevice({
                    brand: res.brand,
                    model: res.model,
                    screenWidth: res.screenWidth,
                    screenHeight: res.screenHeight,
                    system: res.system,
                    isMobile: !(res.system.indexOf('Window') !== -1 || res.system.indexOf('window') !== -1 || res.system.indexOf('mac') !== -1 || res.system.indexOf('Mac') !== -1)
                });

                stopWatch(); //停止监视
            },
            fail(res) {
                console.log("getSystemInfo 调用失败", res);
            },
        });
    })
}

export default system;