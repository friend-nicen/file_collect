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

/* 记录操作 */
/* 打开设置页面 */
const open = (text, box) => {
    /* 弹出提醒 */
    load.info(text, (res) => {
        /* 弹出 */
        load.loading();
        /* 错误处理 */
        try {
            /* 请求登录接口 */
            uni.request({
                url: `${api.update}`,
                data: {
                    type: res.confirm,
                    box: box
                },
                method: "POST"
            }).then((res) => {
                /* 如果登录成功！ */
                if (res.data.code) {
                    /* 跳转界面，访问 */
                    uni.navigateTo({
                        url: `/pages/web/web?hide=1&url=${encodeURIComponent(res.data.data)}`
                    })
                } else {
                    load.error(res.data.errMsg); //弹出错误信息
                }
            }).catch(e => {
                console.log(e);
                load.error(e)
            }).finally(() => {
                load.loaded();
            });
        } catch (e) {
            console.log(e)
            load.error(e);
        }
    }, {
        showCancel: true
    })
}


/* 加载盒子数据 */
const loadData = (box, type) => {

    try {

        /* 初次加载，显示加载状态 */
        if (!loaded.value) {
            load.loading("加载中...");
        }

        /* 请求的接口 */
        const link = parseInt(type) === 1 ? api.files : api.my;

        /* 请求登录接口 */
        uni.request({
            url: `${link}?box=${box}`,
            method: "GET"
        }).then((res) => {

            /* 需要更新用户信息 */
            if (res.data.update) {
                /* 弹出 */
                open(res.data.alert, box);
            }

            /* 如果登录成功！ */
            if (res.data.code) {

                /* 分组并排序 */
                files.value = Object.values(res.data.data.reduce((lists, file) => {

                    /* 提取用户的基本数据 */
                    const {id, user, nickname, avatar} = file;

                    /* 如果第一次遍历该user */
                    if (!lists[user]) {
                        lists[user] = {user, nickname, avatar: getAvatar(avatar), data: []};
                    }

                    /* 保存用户的文件记录 */
                    lists[user].data.push({
                        id,
                        file_name: file.file_name,
                        file_size: file.file_size,
                        file_ext: file.file_ext,
                        file_url: file.file_url,
                        upload_time: file.upload_time,
                        delete: file.delete
                    });

                    return lists;

                }, {})).map(item => {
                    /* 针对文件按照时间进行排序 */
                    item.data = item.data.sort((a, b) => dayjs(b.upload_time) - dayjs(a.upload_time));
                    return item;
                });


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