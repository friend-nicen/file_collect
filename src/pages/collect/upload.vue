<template>
  <v-user v-if="!!$user.token && loaded">
    <v-help/>
    <v-statistic v-if="(box.visible === 1) || (box.permiss > 0)"/>
    <v-detail/>
    <v-swiper/>
    <v-ads :config="$sys.ad.config.upload"/>
    <v-store/>
  </v-user>
</template>

<script setup>

import {loadBox, share} from '@/common/sys/box'
import {onShareAppMessage} from "@dcloudio/uni-app";
import VDetail from "./v-detail/v-detail.vue";
import VHelp from "./v-help/v-help.vue";
import VStatistic from "./v-statistic/v-statistic.vue";

import VSwiper from "./v-swiper/v-swiper.vue";
import VStore from "#/v-store/v-store.vue";
import {provide} from 'vue'
import load from "@/common/util/load";
import api from "@/service/api";
import system from "@/store/system";

/* 获取传递的ID */
const props = defineProps(['id', 'scene']);

/** @type AppConfiguration */
const sys = system(); //变量

/* 加载数据 */
const {
  box, loaded, reload
} = loadBox(!props.id ? props.scene : props.id, 3, true)


/* 模板消息+1 */
/* 模板消息 */
const subscribe = () => {
  try {
    /* 提示 */
    load.loading();
    /* 请求登录接口 */
    uni.request({
      url: api.user_scribe,
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
  load.info(sys.env.alert_on_end, (res) => {
        /* 是否点击确认 */
        const to = res.confirm;
        /* 订阅模板 */
        if (to) {
          /* 提示 */
          load.loading();
          /* 订阅 */
          uni.requestSubscribeMessage({
            tmplIds: [sys.env.tmp_id_on_end],
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
      , {
        showCancel: true
      })
}


/* 依赖注入 */
provide('box', box);
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
  font-size: 13.5px;
  font-weight: 350;
  color: $text-6;
}
</style>