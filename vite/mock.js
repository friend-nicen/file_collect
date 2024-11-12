/* eslint-disable */

import * as http from 'http'
import * as url from "url";

/**
 * 参数包装
 * @param req
 * @param res
 */
export function wrap(req, res) {

    /* 输出json数据 */
    res.reply = function (code = 1, errMsg, data = []) {

        /* 响应头 */
        this.writeHead(200, {'Content-Type': 'application/json;charset=utf8'});

        /* 输出数据 */
        this.end(JSON.stringify({
            code: code,
            data: data,
            errMsg: errMsg
        }));

    }

    // 返回 Promise 以处理异步操作
    return new Promise((resolve) => {

        const method = req.method.toLowerCase();

        let data = null;

        if (method === 'get') {
            // 解析 URL 查询字符串
            const parsedUrl = url.parse(req.url, true);
            data = parsedUrl.query;
            resolve(data);
        } else if (method === 'post') {
            // 用于存储 POST 数据
            let body = '';

            req.on('data', (chunk) => {
                body += chunk.toString(); // 将数据转换为字符串
            });

            req.on('end', () => {
                if (req.headers['content-type'].includes('application/x-www-form-urlencoded')) {
                    // 解析 x-www-form-urlencoded 类型的 POST 数据
                    data = querystring.parse(body);
                } else if (req.headers['content-type'].includes('application/json')) {
                    // 解析 JSON 类型的 POST 数据
                    data = JSON.parse(body);
                }

                /* 完毕 */
                resolve(data);

            });

        }


    });
}


/**
 * 处理请求
 * @param req
 * @param res
 */
async function handleRequest(req, res) {

    try {

        /* 包装请求对象 */
        const data = await wrap(req, res);
        const parsedUrl = url.parse(req.url, true);
        const path = parsedUrl.pathname; //请求路径

        /* 匹配接口 */
        const match = mocks.find(mock => {
            if (mock.api === path) {
                res.reply(1, 'ok！', mock.data);
                return true;
            }
        });

        if (!match) {
            return res.reply(0, "404");
        }


    } catch (e) {
        console.log(e)
    } finally {
        res.end();
    }
}


/*
* @author 友人a丶
* @date 2022-07-11
* 全局接口
* */
const api = {
    login: "/app/api/login", //登录接口
    logout: "/app/api/logout", //用户注销
    count: "/app/api/count", //获取任务数量
    create: "/app/api/create", //创建任务
    basic: "/app/box/edit", //获取任务详情
    list: "/app/api/list", //获取用户名单
    self: "/app/api/box", //获取任务列表
    used: "/app/api/used", //获取使用过的任务列表
    pay: "/app/pay/order", //申请支付
    nickname: "/app/api/nickname", //修改昵称
    avatar: "/app/api/avatar", //修改头像
    collect: "/app/box/collect", //任务详情页
    shareBox: "/app/box/shareBox", //任务分享页
    share: "/app/hook/share", //记录分享日志
    qrcode: "/app/box/qrcode", //分享小程序码
    copyLink: "/app/box/copyLink", //获取分享链接
    closeAd: "/app/box/closeAd", //关闭广告
    changeStatus: "/app/box/changeStatus", //修改任务状态
    delete: "/app/box/delete", //删除任务
    sharePermiss: "/app/box/sharePermiss", //共享权限
    apply: "/app/hook/apply", //接受权限共享
    box: "/app/hook/box", //上传界面的任务信息
    next: "/app/hook/next", //准备上传
    upload: "/app/hook/upload", //上传文件
    files: "/app/hook/getfiles", //任务的上传记录
    logs: "/app/hook/getlogs", //任务的上传日志
    my: "/app/hook/getMys", //指定任务内的自己的上传记录
    remove: "/app/hook/remove", //移除文件
    sheet: "/app/hook/sheet", //获取任务的表格信息
    bundle: "/app/box/bundle", //获取任务的压缩包
    cancel: "/app/hook/cancel", //取消共享
    shares: "/app/box/shares", //共享列表
    revoke: "/app/box/revoke", //取消指定的共享
    privacy: "/app/api/privacy", //取消指定的共享
    notice: "/app/box/getNotice", //获取公众号授权链接
    alert: "/app/box/alert", //弹出提醒
    subscribe: "/app/box/subscribe", //到期提醒
    user_scribe: "/app/hook/subscribe", //到期提醒
    update: "/app/hook/update", //更新用户信息
}


/**
 * mock列表
 */
const mocks = [
    {
        api: api.login,
        data: {
            "ad": {
                "box": true,
                "config": {
                    "bundle": {
                        "adid": "",
                        "image": "",
                        "show": false,
                        "type": 3
                    },
                    "collect": {
                        "adid": "adunit-0",
                        "image": "",
                        "show": true,
                        "type": 3
                    },
                    "filelist": {
                        "adid": "adunit-1",
                        "image": "",
                        "show": true,
                        "type": 3
                    },
                    "insert": {
                        "adid": "adunit-2",
                        "show": true
                    },
                    "preload": {
                        "adid": "adunit-3",
                        "image": "",
                        "show": false,
                        "type": 3
                    },
                    "prize": {
                        "adid": "adunit-4"
                    },
                    "upload": {
                        "adid": "adunit-5",
                        "image": "",
                        "show": true,
                        "type": 3
                    }
                },
                "show": 1
            },
            "env": {
                "alert": "收纳箱的收集状态从【正在收集】 变成【已结束】后，收集到的文件只会继续保留7天（不结束的话就一直在），是否要添加文件到期提醒？",
                "alert_on_end": "您正在订阅任务收集结束提醒，开启后将在任务结束收集的前一小时向您发送订阅通知，是否继续？",
                "board": "1. 收纳箱的收集状态从【正在收集】 变成【已结束】后，收集到的文件只会继续保留7天，还请大家记得导出收集好的文件🐱‍🐉，还有收纳箱被删除后，所有文件会同步删除。2. 点击【我的】头像和昵称可更新个人信息。 3. 良性的发展离不开您的支持，看见广告的话，烦请大家点一下哈！",
                "cdn": "http://127.0.0.1",
                "donate": true,
                "icon": {
                    "file": "/icon/file.png",
                    "help": "/icon/help.png",
                    "image": "/icon/image.png"
                },
                "max": 380,
                "menu": [
                    {
                        "icon": "icon-liushui",
                        "path": "/pages/web/web?url=https%3A%2F%2Fmini.nicen.cn%2Findex%2Fupdate",
                        "title": "更新日志"
                    },
                    {
                        "icon": "icon-shoucang",
                        "path": "/pages/web/web?url=https%3A%2F%2Fmp.weixin.qq.com%2Fs%2FCs_iOHszK19aoj4x9xWTOQ",
                        "title": "公众号Go"
                    }
                ],
                "number": {
                    "inputInfo": 30,
                    "instruction": 600,
                    "itemName": 100,
                    "listName": 10,
                    "title": 30
                },
                "preview": "https://127.0.0.1",
                "title": "文件快收小工具",
                "tmp_id_on_end": "yGtMABjVhTRsw2pc_pGFTtQ0_odE207Rmoz72V0NU0Y",
                "webview": {
                    "help": "http://127.0.0.1/index/help",
                    "update": "http://127.0.0.1/index/update",
                    "upload": "http://127.0.0.1/index/upload"
                }
            },
            "user": {
                "avatar": "/avatar/20241112/c3b9309368fd2f896876b80fb1d129c0.jpg",
                "count": 1,
                "id": 1,
                "login_time": "2024-11-12 11:50:35",
                "nickname": "文件快收小工具",
                "register": "2022-06-20 13:18:53",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9dkeGU0N",
                "vip": 0
            }
        }
    }
]


export default function () {

    /* http服务器 */
    const server = http.createServer(handleRequest);

    /* 监听端口 */
    server.listen(5723, '0.0.0.0', () => {
        console.log('Mock地址：http://127.0.0.1:5723');
    });


}

