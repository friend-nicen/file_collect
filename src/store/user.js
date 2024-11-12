import {
    defineStore
} from 'pinia';

export default defineStore('user', {
    state: () => {
        return {
            // 用户ID
            id: null,
            // Token
            token: null,
            //客户头像
            avatar: "",
            //客户昵称
            nickname: "微信用户",
            // 收纳箱个数
            count: 0,
            // 是VIP
            vip: false,
            // 上次登录
            login_time: "",
            // 注册时间
            register: ""
        };
    },

    actions: {
        /**
         * 记录用户信息
         * @param info
         */
        login(info) {
            this.$state = info; //更新个人信息
        },
        /**
         * 更新个人信息
         **/
        setInfo(info) {
            this.nickname = info.nickname;
            this.avatar = info.avatar;
        },
        /**
         * 更新盒子总数
         */
        setCount(count) {
            this.count = count;
        },
    },
});
