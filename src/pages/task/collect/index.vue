<template>
  <v-user v-if="!!$user.token && loaded">
    <v-detail/>
    <v-statistic/>
    <v-swiper/>
    <v-store/>
  </v-user>
</template>

<script setup>

import {loadBox, share} from '@/common/sys/box'
import {onShareAppMessage} from "@dcloudio/uni-app";
import VDetail from "./v-detail/v-detail.vue";
import VStatistic from "./v-statistic/v-statistic.vue";
import VSwiper from "./v-swiper/v-swiper.vue";
import {provide, watch} from 'vue'
import VStore from "#/v-store/v-store.vue";
import system from "@/store/system";
import load from "@/common/util/load";
import api from "@/service/api";


/* 获取传递的ID */
const props = defineProps(['id']);

/** @type AppConfiguration */
const sys = system(); //变量

/* 加载数据 */
const {
  box, loaded, reload
} = loadBox(props.id, 0, true)


/* 模板消息+1 */
/* 模板消息 */
const subscribe = () => {
  try {
    /* 提示 */
    load.loading();
    /* 请求登录接口 */
    uni.request({
      url: api.subscribe,
      method: "POST",
      data: {
        box: box.value.id
      }
    }).then((res) => {
      if (res.data.code === 1) {
        load.info('订阅成功');
        reload(); //重新加载
      } else {
        load.error(res.data.errMsg);
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
}

/* 模板消息 */
const alert = () => {
  /* 弹出提醒 */
  load.info(
      sys.env.alert,
      (res) => {
        const to = res.confirm;
        try {
          /* 请求登录接口 */
          uni.request({
            url: api.alert,
            method: "POST",
            data: {
              box: box.value.id
            }
          }).then((res) => {
            /* 结果 */
            if (res.data.code === 1) {
              /* 标记 */
              box.value.alert = 1;
              /* 订阅模板 */
              if (to) {
                /* 提示 */
                load.loading();
                /* 订阅 */
                uni.requestSubscribeMessage({
                  tmplIds: [res.data.data],
                  success(res) {
                    if (JSON.stringify(res).indexOf('reject') === -1) {
                      subscribe();
                    } else {
                      load.error("权限请求失败！如未弹出权限申请，请点击【右上角】-【设置】-【通知】-【接收文件到期提醒】后重新尝试！")
                    }
                  },
                  fail(e) {
                    load.error(e.errMsg)
                  },
                  complete() {
                    load.loaded();
                  }
                })
              }
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
      }, {
        showCancel: true
      })
}

/* 是否需要弹出提示 */
watch(() => box.value, () => {
  if (box.value.status === 1 && !box.value.alert) {
    alert();
  }
})

/* 依赖注入 */
provide('box', box);
/* 依赖注入 */
provide('alert', alert);

/* 分享时触发 */
onShareAppMessage(() => {
  share(box.value.id); //记录分享事件
  return {
    title: box.value.title,
    path: `/pages/collect/upload?id=${box.value.id}`
  }
})

</script>


<style lang="scss" scoped>

/* 公共样式 */
@import '@/assets/css/common.scss';

:deep(.task) {
  @include card($margin: 14rpx 2.5% 10rpx 2.5%, $padding: 20rpx 30rpx 20rpx 30rpx, $width: 95%);
  display: flex;
  flex-wrap: wrap;
  font-size: 27rpx;
  font-weight: 350;
  color: $text-6;
}
</style>