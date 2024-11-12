/*
* @author 友人a丶
* @date 
* 
* */

import {computed, inject, ref} from "vue";
import {store} from "@/common/util/common";
import initSys from '@/store/system'
import load from "@/common/util/load";
import api from "@/service/api";

export default function () {

    /* 文件下载的弹出 */
    const downDialog = ref(null);
    const box = inject('box');
    const sys = initSys(); //系统

    /* 时间范围 */
    const selectRange = ref([box.value.start_time, box.value.end_time]);


    /* 可选的时间范围 */
    const disableDatetime = {
        start: box.value.start_time,
        end: box.value.end_time
    };

    /* 组件对象 */
    const refSelectRange = ref(null);

    /* 选择时间后触发 */
    const startDown = async () => {
        /* 下载还是复制 */
        if (waitHandle.data.download) {
            downDialog.value.open('bottom');
        } else {
            /* 处理下载 */
            load.loading("加载中...");

            const link = await getZip();

            /* 如果打包成功，则复制链接 */
            if (link) {
                copyLink(link);//结果
            }

            load.loaded();
        }
    }


    /* 下载进度 */
    const waitHandle = store({
        type: 1,//打包的类型
        all: true, //选择全部文件
        loading: false, //正在下载
        size: 0, //已下载
        percent: 0, //百分比
        loaded: false, //下载完毕
        tempPath: "", //本地路径
        total: 0,
        download: true,
        task: null //下载任务
    });


    /* 复制 */
    const copyLink = (link) => {

        /* 复制 */
        uni.setClipboardData({
            data: link,
            showToast: false,
        });

        /* 提示 */
        load.info("链接复制成功！您可直接在浏览器粘贴访问下载！")
    }


    /* 打开弹窗 */
    const openDialog = (type, download = true) => {

        waitHandle.reset(); //重置数据
        waitHandle.data.type = type;
        waitHandle.data.download = download;

        /* 下载压缩包，可选时间范围 */
        if (type === 1) {
            /* 弹出操作选项 */
            uni.showActionSheet({
                itemList: ['下载全部文件', '指定时间范围'],
                success: async function (res) {
                    /* 如果选择下载 */
                    if (!res.tapIndex) {

                        waitHandle.data.all = true; //全部文件
                        await startDown(); //开始下载


                    } else {
                        waitHandle.data.all = false; //全部文件
                        refSelectRange.value.show(); //显示时间选择
                    }
                }
            });
        } else {
            downDialog.value.open('bottom');
        }
    }


    /* 获取压缩包 */
    const getZip = () => {
        return new Promise((resolve) => {

            /* 请求数据 */
            let data = {
                box: box.value.id,
            }

            /* 需不需要进行小程序下载的大小检测 */
            if (waitHandle.data.download) {
                data.scene = 2;
            } else {
                data.scene = 1;
            }

            /* 如果下载指定时间范围内的文件 */
            if (!waitHandle.data.all) {
                data = Object.assign(data, {
                    start: selectRange.value[0],
                    end: selectRange.value[1]
                })
            }

            /* 请求登录接口 */
            uni.request({
                url: api.bundle,
                method: "POST",
                data: data
            }).then((res) => {
                /* 如果登录成功！ */
                if (res.data.code) {
                    const link = res.data.data;
                    resolve(link); //返回下载链接
                } else {
                    load.error(res.data.errMsg); //弹出错误信息
                    resolve(false); //终止
                }
            }).catch(e => {
                console.log(e);
                load.error(e);
                resolve(false);
            });
        });
    }


    /* 获取表格 */
    const getExcel = () => {
        return new Promise((resolve) => {
            /* 请求登录接口 */
            uni.request({
                url: `${api.sheet}?box=${box.value.id}`,
                method: "GET"
            }).then((res) => {
                /* 如果登录成功！ */
                if (res.data.code) {
                    const link = res.data.data;
                    resolve(link); //返回下载链接

                } else {
                    load.error(res.data.errMsg); //弹出错误信息
                    resolve(false); //终止
                }
            }).catch(e => {
                console.log(e);
                load.error(e);
                resolve(false);
            });
        });
    }

    /* 下载文件 */
    const handle = async () => {


        /* 没有文件 */
        if (!box.value.count) {
            load.info('箱子里空空的，还没有收集到文件哦');
            return;
        }


        /* 下载完毕直接分享 */
        if (waitHandle.data.loaded) {
            share();
            return;
        }

        /* 判断是否正在下载 */
        if (waitHandle.data.loading) {

            /* 开始下线 */
            waitHandle.data.loading = false;

            /* 标记已下载的状态 */
            if (waitHandle.data.task) {
                waitHandle.data.task.abort();
            }

        } else {

            /* 开始下线 */
            waitHandle.data.loading = true;


            const link = waitHandle.data.type === 1 ? await getZip() : await getExcel();

            /* 下载失败 */
            if (!link) {
                /* 开始下载 */
                waitHandle.data.loading = false;
                return;
            }


            /* 判断是否是电脑端 */
            if (!sys.device.isMobile) {
                waitHandle.data.loading = false; //取消下载的状态
                load.info("电脑端小程序暂不支持直接下载，已自动为您复制下载链接，你可以粘贴到浏览器下载！", () => {
                    uni.setClipboardData({
                        data: link,
                        showToast: false,
                    })
                });
                return;
            }


            /* 开始下载文件 */
            const task = uni.downloadFile({
                url: link,
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
                        /* 提示 */
                        load.info("由于微信机制的原因，文件下载之后，需要转发给好友，转发后可在好友聊天界面找到这个文件！", share);
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


            let recordTotal = false;  //标记是否记录总大小

            /* 保持更新下載情况 */
            task.onProgressUpdate(function (res) {
                /* 如果已经终止 */
                if (!waitHandle.data.loading) {
                    waitHandle.data.task.abort();
                }

                /* 第一次下载记录总大小 */
                if (!recordTotal) {
                    waitHandle.data.total = res.totalBytesExpectedToWrite; //文件总大小
                    recordTotal = true; //标记总大小
                }


                /* 更新进度 */
                waitHandle.data.size = res.totalBytesWritten;
                waitHandle.data.percent = res.progress;
            });


        }
    }

    /* 文件分享 */
    const share = () => {

        /* 分享的文件 */
        const fileName = box.value.title.substring(0, 20) + (waitHandle.data.type === 1 ? '.zip' : '.xlsx');

        try {
            /* 下载成功后分享文件 */
            wx.shareFileMessage({
                /* 文件路径 */
                filePath: waitHandle.data.tempPath,
                /* 指定分享名 */
                fileName: fileName,
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


    /* 按钮文案 */
    const btnText = computed(() => {

        if (waitHandle.data.loading) {
            return "取消下载...";
        } else {
            if (waitHandle.data.type === 1) {
                return waitHandle.data.loaded ? "下载成功，点击转发" : "点击下载文件"
            } else {
                return waitHandle.data.loaded ? "下载成功，点击转发" : "下载并查看表格";
            }
        }
    });

    /* 已下载 */
    const size = computed(() => {
        return !waitHandle.data.size ? '--' : (waitHandle.data.size / 1024 / 1024).toFixed(2);
    })


    /* 总大小 */
    const total = computed(() => {
        return !waitHandle.data.total ? '--' : (waitHandle.data.total / 1024 / 1024).toFixed(2);
    })


    return {
        downDialog,
        waitHandle,
        handle,
        share,
        openDialog,
        btnText,
        size,
        total,
        selectRange,
        refSelectRange,
        disableDatetime,
        startDown
    }
}
