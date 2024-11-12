export default function () {
    //#ifdef MP-WEIXIN
    uni.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
    })
    //#endif

    //#ifdef MP-TOUTIAO
    uni.showShareMenu({
        menus: ['record', 'share']
    })
    //#endif
}