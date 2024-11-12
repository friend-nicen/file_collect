/*
* @author 友人a丶
* @date
* 注册全局组件
* */
import VUser from "@/components/v-user/v-user.vue";
import VAds from "@/components/v-ads/v-ads.vue";

export default function (app) {
    app.component('v-user', VUser);
    app.component('v-ads', VAds);
}
