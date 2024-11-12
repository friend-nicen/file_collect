import {createSSRApp} from 'vue'
import * as Pinia from 'pinia';
import register____global from "@/utils/global";
import load____user from "@/service/sys";
import import____batch from "@/utils/batch";

import App from './App.vue'

export function createApp() {

    const app = createSSRApp(App);
    app.use(Pinia.createPinia());

    import____batch(app);//注册全局组件
    load____user();//加载用户信息
    register____global(app);//注册全局方法

    return {
        app,
        Pinia
    }
}