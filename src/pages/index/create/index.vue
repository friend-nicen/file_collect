<template>
  <v-user v-if="!!$user.token && loaded" :share="false">
    <v-info/>
    <v-mode/>
    <v-see/>
    <v-rename/>
    <v-date/>
    <v-submit/>
  </v-user>
</template>
<script setup>

import VMode from "./v-mode/v-mode.vue";
import VInfo from "./v-info/v-info.vue";
import VSee from "./v-see/v-see.vue";
import VRename from "./v-rename/v-rename.vue";
import VDate from "./v-date/v-date.vue";
import VSubmit from "./v-submit/v-submit.vue";


import {provide, ref} from "vue";
import dayjs from "dayjs";
import api from "@/service/api";
import load from "@/common/util/load";
import {onLogin} from "@/common/util/event";


/* 定义属性 */
const props = defineProps({
  type: {
    required: false,
    default: 1
  },
  id: {
    required: false,
    default: null
  }
});

/* 更新标题 */
uni.setNavigationBarTitle({
  title: ["图片收纳箱", "文件收纳箱"][props.type - 1]
})

/* 加载状态 */
const loaded = ref(props.id === null);

/* 任务数据对象 */
const box = ref({
  title: '',
  Instructions: '',
  type: props.type,
  mode: 1,
  visible: 0,
  rename: 1,
  end_time: dayjs().add(7, 'day').format("YYYY-MM-DD HH:mm"),
  list: 0,
  /* 默认规则 */
  regular: [
    {
      id: 1,
      /* 标记名 */
      column: "姓名"
    },
    {
      id: 2,
      /* 标记名 */
      column: ""
    }
  ]
});

/* 是编辑还是新建 */
provide('edit', props.id !== null);

/* 注入组件级响应式对象 */
provide("box", box);

/* 注入名单列表 */
provide("listSet", ref(Array(5).fill(0).map((item, index) => {
  return {
    name: "名单" + (index + 1),
    list: ""
  };
})));


/**
 * 需要加载任务数据
 */
if (!loaded.value) {

  /* 编辑 */
  box.value.id = parseInt(props.id);

  onLogin(() => {

    load.loading("加载中...");

    try {
      /* 请求登录接口 */
      uni.request({
        url: `${api.basic}?box=${props.id}`,
        method: "GET"
      }).then((res) => {

        /* 如果登录成功！ */
        if (res.data.code) {

          /* 数据赋值 */
          for (let i in res.data.data) {
            box.value[i] = res.data.data[i];
          }

          loaded.value = true; //标记已加载

        } else {
          load.error(res.data.errMsg); //弹出错误信息
        }

      }).catch(e => {
        console.log(e);
        load.error(e)
      }).finally(() => {
        load.loaded(200);
      });

    } catch (e) {
      console.log(e)
      load.error(e);
    }
  });
}


</script>

<style scoped lang="scss">
/* 公共样式 */
@import './index.scss';
</style>