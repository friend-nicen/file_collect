/**
 * @date 2023/8/28
 * @author 爱心发电丶
 */
import load from "@/common/util/load";
import api from "@/service/api";
import hook from "../hook";
import {ref} from "vue";
import dayjs from "dayjs";
import {onUnload} from "@dcloudio/uni-app";

/* 声明初始数据 */
const loaded = ref(false); //加载完毕？
const files = ref([]);//上传记录


/* 处理头像 */
const getAvatar = (avatar) => {
    return avatar.indexOf('http') > -1 ? avatar : `${api.host}${avatar}`
}

/* 加载盒子数据 */
const loadData = (box, type) => {

    try {

        /* 初次加载，显示加载状态 */
        if (!loaded.value) {
            load.loading("加载中...");
        }

        /* 请求登录接口 */
        uni.request({
            url: `${api.logs}?box=${box}`,
            method: "GET"
        }).then((res) => {

            /* 如果登录成功！ */
            if (res.data.code) {

                /* 分组并排序 */
                files.value = res.data.data.sort((a, b) => dayjs(b.upload_time) - dayjs(a.upload_time));

                /* 标记加载状态 */
                if (!loaded.value) {
                    loaded.value = true;
                }

                /* 挂载钩子 */
                hook.action = () => loadData(box, type);

            } else {
                load.error(res.data.errMsg); //弹出错误信息
            }

        }).catch(e => {
            console.log(e);
            load.error(e)
        }).finally(() => {
            load.loaded(); //加载完毕
        });

    } catch (e) {
        console.log(e)
        load.error(e);
    }
}


/* 导出全局变量 */
export default function (box, type) {

    /* 加载初始数据 */
    loadData(box, type);

    /* 卸载原数据 */
    onUnload(() => {
        loaded.value = false;
        files.value = [];
    })

    return {
        loaded,
        loadData: () => loadData(box, type),
        files
    }
}