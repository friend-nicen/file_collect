<template>
  <view class="task" @click="$go('push',`/pages/index/help/index`)">
    <view class="line">
      <text class="label">不会提交？点击查看新手引导</text>
      <uni-icons type="right" size="20" style="margin-bottom: -4rpx;" color="#2979FF"></uni-icons>
    </view>
  </view>
</template>

<script setup>
import {inject} from "vue";
/* 注入盒子信息 */
const box = inject('box');
</script>

<style lang="scss" scoped>

/* 公共样式 */
@import '@/assets/css/common.scss';

.task {

  cursor: default;


  /* 表单项 */
  .line {
    width: 100%;
    display: flex;
    margin: 12rpx 5rpx 12rpx 5rpx;
    justify-content: space-between;
    align-items: center;

    .label {
      margin-right: 36rpx;
      white-space: nowrap;
      position: relative;
      font-size: 28rpx;
    }
  }
}


</style>
