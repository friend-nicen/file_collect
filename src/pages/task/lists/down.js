/*
* @author 友人a丶
* @date 
* 
* */

import {ref} from "vue";
import {delay, store} from "@/common/util/common";
import load from "@/common/util/load";
import initSys from '@/store/system'

export default function () {


    /* 系统配置 */
    const sys = initSys();
    /* 预览地址 */
    const host = sys.env.preview;


    /* 文件下载的弹出 */
    const downDialog = ref(null);


    /* 下载进度 */
    const waitHandle = store({
        file: null,//文件对象
        loading: false, //正在下载
        size: 0, //已下载
        percent: 0, //百分比
        loaded: false, //下载完毕
        tempPath: "", //本地路径
        task: null //下载任务
    })
    /* 下载文件 */
    const handle = () => {
        /* 判断是否正在下载 */
        if (waitHandle.data.task) {

            /* 任务收尾 */
            load.loaded();
            downDialog.value.close();
            waitHandle.data.task.abort();

        } else {

            /* 开始下线 */
            waitHandle.data.loading = true;

            /* 延时执行 */
            delay(() => {

                /* 开始下载文件 */
                const task = uni.downloadFile({
                    url: host + waitHandle.data.file.file_url,
                    success: (res) => {

                        /* 异常 */
                        if (res.statusCode !== 200) {
                            load.error("文件下载异常，请重新尝试或咨询客服！");
                            waitHandle.data.loaded = false;
                            return;
                        }

                        /* 请求成功 */
                        if (res.header["Content-Type"].indexOf('json') === -1) {
                            /* 标记已下载的状态 */
                            waitHandle.data.loaded = true;
                            /* 保存临时文件目录 */
                            waitHandle.data.tempPath = res.tempFilePath;
                        } else {
                            load.error("文件不存在！")
                        }
                    },
                    fail: (e) => {
                        load.error(e);
                    },
                    complete() {
                        /* 做标记 */
                        waitHandle.data.loading = false;
                    }
                });


                /* 挂载终止函数 */
                waitHandle.data.task = {
                    abort: () => {
                        task.abort()
                    }
                }


                /* 保持更新下載情况 */
                task.onProgressUpdate(function (res) {
                    /* 如果已经终止 */
                    if (!waitHandle.data.loading) {
                        task.abort();
                    }
                    /* 更新进度 */
                    waitHandle.data.size = res.totalBytesWritten;
                    waitHandle.data.percent = res.progress;
                });

            }, 500)
        }
    }

    /* 文件分享 */
    const share = () => {
        /* 分享的文件 */
        const file = waitHandle.data.file;

        try {
            /* 下载成功后分享文件 */
            wx.shareFileMessage({
                /* 文件路径 */
                filePath: waitHandle.data.tempPath,
                /* 指定分享名 */
                fileName: `${file.file_name}.${file.file_ext}`,
                /* 分享成功之后 */
                success(res) {
                    load.success("转发成功");
                },
                fail: (e) => {
                    load.error(e)
                }
            });
        } catch (e) {
            load.error(e)
        }

    }


    return {
        downDialog,
        waitHandle,
        handle,
        share
    }
}
