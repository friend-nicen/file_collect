/* 主域名 */
const host = "http://127.0.0.1:5723";

/* 系统接口 */
export default {
    cdn: null, //cdn
    host: host, //接口
    preview: null, //预览地址
    login: host + "/app/api/login", //登录接口
    logout: host + "/app/api/logout", //用户注销
    count: host + "/app/api/count", //获取任务数量
    create: host + "/app/api/create", //创建任务
    basic: host + "/app/box/edit", //获取任务详情
    list: host + "/app/api/list", //获取用户名单
    self: host + "/app/api/box", //获取任务列表
    used: host + "/app/api/used", //获取使用过的任务列表
    pay: host + "/app/pay/order", //申请支付
    nickname: host + "/app/api/nickname", //修改昵称
    avatar: host + "/app/api/avatar", //修改头像
    collect: host + "/app/box/collect", //任务详情页
    shareBox: host + "/app/box/shareBox", //任务分享页
    share: host + "/app/hook/share", //记录分享日志
    qrcode: host + "/app/box/qrcode", //分享小程序码
    copyLink: host + "/app/box/copyLink", //获取分享链接
    closeAd: host + "/app/box/closeAd", //关闭广告
    changeStatus: host + "/app/box/changeStatus", //修改任务状态
    delete: host + "/app/box/delete", //删除任务
    sharePermiss: host + "/app/box/sharePermiss", //共享权限
    apply: host + "/app/hook/apply", //接受权限共享
    box: host + "/app/hook/box", //上传界面的任务信息
    next: host + "/app/hook/next", //准备上传
    upload: host + "/app/hook/upload", //上传文件
    files: host + "/app/hook/getfiles", //任务的上传记录
    logs: host + "/app/hook/getlogs", //任务的上传日志
    my: host + "/app/hook/getMys", //指定任务内的自己的上传记录
    remove: host + "/app/hook/remove", //移除文件
    sheet: host + "/app/hook/sheet", //获取任务的表格信息
    bundle: host + "/app/box/bundle", //获取任务的压缩包
    cancel: host + "/app/hook/cancel", //取消共享
    shares: host + "/app/box/shares", //共享列表
    revoke: host + "/app/box/revoke", //取消指定的共享
    privacy: host + "/app/api/privacy", //取消指定的共享
    notice: host + "/app/box/getNotice", //获取公众号授权链接
    alert: host + "/app/box/alert", //弹出提醒
    subscribe: host + "/app/box/subscribe", //到期提醒
    user_scribe: host + "/app/hook/subscribe", //到期提醒
    update: host + "/app/hook/update", //更新用户信息
}