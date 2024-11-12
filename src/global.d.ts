/**
 * 添加自定义全局组件的类型
 */
import UniNoticeBar from "/uni_modules/uni-notice-bar/components/uni-notice-bar/uni-notice-bar.vue";
import VAds from "/components/v-ads/v-ads.vue";
import VUser from "/components/v-user/v-user.vue";

/* 设备信息 */
interface DeviceInfo {
    brand: string | null,
    model: string | null,
    system: string | null,
    isMobile: boolean | null,
    screenWidth: number,
    screenHeight: number,
}

/* 首页图标 */
interface IconInfo {
    image: string | null,
    file: string | null,
    help: string | null,
}

/* 字符数限制 */
interface NumberLimitations {
    listName: number;
    itemName: number;
    title: number;
    instruction: number;
    inputInfo: number;
}

/* 用户界面菜单项 */
type MenuItem = {
    icon: string;
    path: string;
    title: string;
};

/* webview配置 */
interface WebViewUrls {
    help: string,
    upload: string,
    update: string,
}


/* env参数类型 */
interface EnvironmentInfo {
    icon: IconInfo,
    board: string,
    alert: string,
    alert_on_end: string,
    tmp_id_on_end: string,
    donate: false,
    number: NumberLimitations,
    webview: WebViewUrls,
    menu: MenuItem[],
    max: string,
    cdn: string,
    preview: string,
}


/* 广告配置 */
interface AdConfig {
    /* 全局是否展示广告 */
    show: boolean;
    /* 任务是否展示广告 */
    box: boolean;
    /* 各个页面的广告配置 */
    config: {
        /* 激励视频广告ID */
        prize: {
            adid: string
        },
        /* 任务界面 */
        collect: {
            show: boolean;
            type: number;
            adid: string;
            image: string;
        };
        /* 准备上传 */
        preload: {
            show: boolean;
            type: number;
            adid: string;
            image: string;
        };
        /* 上传 */
        upload: {
            show: boolean;
            type: number;
            adid: string;
            image: string;
        };
        /* 文件列表 */
        filelist: {
            show: boolean;
            type: number;
            adid: string;
            image: string;
        };
        /* 文件打包 */
        bundle: {
            show: boolean;
            type: number;
            adid: string;
            image: string;
        };
        /* 上传页面的插屏广告 */
        insert: {
            show: boolean;
            adid: string;
        };
    };
}


/* 系统配置类型 */
interface AppConfiguration {
    device: DeviceInfo,
    env: EnvironmentInfo,
    ad: AdConfig,
    privacy: {
        show: boolean,
        protocol: string
    }
}

/* 用户信息类型 */
interface UserInfo {
    id: string | null,
    token: string | null,
    avatar: string | null,
    nickname: string | null,
    count: number,
    vip: boolean,
    login_time: string,
    register: string
}


// 参考：
declare module "vue" {
    export interface GlobalComponents {
        UniNoticeBar: typeof UniNoticeBar,
        VAds: typeof VAds,
        VUser: typeof VUser
    }
}


// 参考：
declare module "@vue/runtime-core" {
    export interface ComponentCustomProperties {
        $sys: AppConfiguration,
        $user: UserInfo,
        $go: (type: string, path: string) => void
    }
}


export {}

