<template>
  <v-user v-if="!!$user.token && loaded">

    <view class="task title">
      {{ box.title }}
    </view>

    <view class="task">
      将二维码发送给他人，他人可通过微信扫码进入小程序提交文件
    </view>

    <view class="task" style="justify-content: center;">
      <image mode="widthFix" class="qrcode" :src="mini_code"></image>
    </view>


    <view class="main-button">
      <button type="primary" @click="save" style="background-color: #007aff;">
        <text class="iconfont icon-xiaoxi"></text>
        <text>点击保存二维码</text>
      </button>
    </view>

  </v-user>
</template>

<script setup>

import {share, loadBox} from '@/common/sys/box'
import {onShareAppMessage} from '@dcloudio/uni-app'
import {computed} from "vue";
import api from "@/service/api";


/* 获取传递的ID */
const props = defineProps(['id']);

/* 初始化任务信息 */
const {
  box, loaded
} = loadBox(props.id, 2);


/* 任务小程序码 */
const mini_code = computed(() => {
  const qrcode = box.value.qrcode;
  return qrcode.indexOf('http') > -1 ? qrcode : `${api.host}${qrcode}`
});


/**
 * 保存小程序码
 */
const save = () => {
  uni.previewImage({
    urls: [mini_code.value],
    current: mini_code.value
  });
}


/* 分享时触发 */
onShareAppMessage(() => {

  share(box.value.id); //记录分享事件

  return {
    title: box.value.title,
    path: `/pages/collect/upload?id=${box.value.id}`
  }
});


</script>

<style lang="scss" scoped>
/* 公共样式 */
@import '@/assets/css/common.scss';

.task {

  @include card($margin: 14rpx 2.5% 10rpx 2.5%, $padding: 20rpx 30rpx 20rpx 30rpx, $width: 95%);
  display: flex;
  flex-wrap: wrap;
  font-size: 32rpx;
  line-height: 1.8;
  font-weight: 500;
  color: $text-6;

  .qrcode {
    max-width: 380rpx;
    min-height: 380rpx;
  }
}

.title {
  justify-content: center;
  font-size: 36rpx;
}

/* 底部分享按钮 */
.main-button {
  width: 100%;
  margin: 36rpx 5rpx 25rpx 5rpx;
  padding: 10rpx 24rpx 5rpx 24rpx;

  .iconfont {
    font-size: 36rpx;
    margin-right: 15rpx
  }
}
</style>
