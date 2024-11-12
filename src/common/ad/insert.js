import initSys from "@/store/system.js"
/* 插入插屏广告 */
export default function insertAd() {

    const system = initSys(); //系统设置
    let loaded = false; //广告加载状态

    // 支持插屏广告
    if (wx.createInterstitialAd) {

        /* 创建插屏广告 */
        const insertAd = wx.createInterstitialAd({
            adUnitId: system.ad.config.insert.adid
        });

        /* 加载完毕 */
        insertAd.onLoad(() => {
            loaded = true;
        });

        /* 加载失败 */
        insertAd.onError((e) => {
            console.log(e);
            loaded = false;
        })


        /* 展示广告 */
        return () => {
            if (loaded) {
                insertAd.show();
            }
        }
    }


}