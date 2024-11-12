<template>
  <!-- 手机才显示提醒  -->
  <template v-if="$sys.device.isMobile && !showed && !show">
    <view :style="{left:(menuButtonInfo.left+16)+'px'}" class="angle"></view>
    <view class="step">
      <view class="contents">点击上方添加到我的小程序，方便下次使用！
        <view class="cancel" @click="close">关闭</view>
      </view>
    </view>
  </template>
</template>
<script>
export default {
  options: {
    virtualHost: true
  }
}
</script>
<script setup>
import {ref} from 'vue'

/* 数据区域 */
const app = getApp();
const showed = uni.getStorageSync("showMsg"); //是否展示过提醒

const show = ref(false); //响应式
const menuButtonInfo = uni.getMenuButtonBoundingClientRect(); //获取胶囊的位置

/* 关闭提醒 */
const close = () => {
  show.value = true;
  uni.setStorageSync("showMsg", true);
}
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
