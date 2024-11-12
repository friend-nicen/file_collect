/**
 * @date 2023/8/28
 * @author 爱心发电丶
 */
import load from "@/common/util/load";
import api from "@/service/api";
import hook from "../hook";
import dayjs from "dayjs";
import {ref} from "vue";

/* 声明初始数据 */
const type = ["图片收纳箱", "文件收纳箱", "来自好友共享"]; //任务类型
const loaded = ref(false); //加载完毕？
const box = ref([]);//盒子数据

/* 加载盒子数据 */
const loadData = () => {

    try {

        /* 初次加载，显示加载状态 */
        if (!loaded.value) {
            load.loading("加载中...");
        }

        /* 请求登录接口 */
        uni.request({
            url: api.self,
            method: "GET"
        }).then((res) => {

            /* 如果登录成功！ */
            if (res.data.code) {
                /* 排序 */
                box.value = res.data.data.sort((a, b) => {
                    if (a.status !== b.status) {
                        return a.status - b.status;
                    } else {
                        return dayjs(b.start_time).diff(dayjs(a.start_time));
                    }
                });

                /* 标记加载状态 */
                if (!loaded.value) {
                    loaded.value = true;
                }

                /* 挂载钩子 */
                hook.action = loadData;

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
export default function () {

    /* 加载初始数据 */
    loadData();

    return {
        loaded,
        type,
        box
    }
}