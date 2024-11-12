import initSys from "@/store/system.js"
import load from "@/common/util/load";


/* 激励视频观看 */
export default function watchVideo(message = "抱歉，您未完整观看，无法为您去除广告，给您带来的不便敬请谅解！感谢！") {

    const system = initSys(); //系统设置

    return new Promise(resolve => {

        /* 如果全局关闭广告 */
        if (!system.ad.show) {
            resolve(true);
            return;
        }

        load.loading("加载广告...");

        try {

            // 在页面onLoad回调事件中创建激励视频广告实例
            if (wx.createRewardedVideoAd) {

                /* 创建激励视频广告 */
                const videoAd = wx.createRewardedVideoAd({
                    adUnitId: system.ad.config.prize.adid
                });

                videoAd.onLoad(() => {
                });

                videoAd.onError(() => {
                    resolve(true);
                })


                /* 判断广告如何关闭的 */
                videoAd.onClose((res) => {
                    if (res && res.isEnded) {
                        resolve(true);
                    } else {
                        load.error(message);
                        resolve(false);
                    }
                });


                // 用户触发广告后，显示激励视频广告
                if (videoAd) {
                    videoAd.show()
                        .catch(() => {
                            // 失败重试
                            videoAd.load()
                                .then(() => videoAd.show())
                                .catch(() => {
                                    resolve(true)
                                });
                        })
                } else {
                    resolve(true)
                }

            } else {
                resolve(true);
            }

        } catch (e) {
            console.log(e);
            resolve(true);
        } finally {
            load.loaded(); //关闭加载
        }
    })
}