<template>
  <view></view>
</template>
<script setup>
/* 获取传递的ID */

import load from "@/common/util/load";
import api from "@/service/api";
import {onLogin} from "@/common/util/event";

/* 传递的ID */
const props = defineProps(['id']);

/* 登录之后触发 */
onLogin(() => {
  /* 询问 */
  load.confirm("您的好友正在向您共享文件收纳箱的管理权限，您确定接受吗？", () => {

    load.loading(); //加载中

    try {
      /* 请求登录接口 */
      uni.request({
        url: `${api.apply}?box=${props.id}`,
        method: "POST"
      }).then((res) => {

        /* 如果登录成功！ */
        if (res.data.code) {
          /* 弹出错误信息 */
          load.info(res.data.errMsg, () => {
            load.delay(`/pages/task/collect/index?id=${props.id}`, 0);
          });
        } else {
          /* 弹出错误信息 */
          load.info(res.data.errMsg, () => {
            load.delay('/pages/index/list/index', 0, false);
          });
        }

      }).catch(e => {
        console.log(e);
        load.error(e)
      }).finally(() => {
        load.loaded(0);
      });

    } catch (e) {
      console.log(e)
      load.error(e);
    }

  });
})
</script>