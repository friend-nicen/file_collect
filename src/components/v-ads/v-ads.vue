<template>
  <!-- 流量主广告 -->
  <!-- 如果是手机端才显示广告 -->
  <!-- 全局展示广告、任务展示广告、版位展示 -->
  <view class="ad-item" v-if="$sys.ad.show && $sys.ad.box && ad.show">

    <!-- 跳转小程序 -->
    <template v-if="ad.type === 1">
      <!-- 判断广告位置 -->
      <image class="image" :src="ad.image" @click="toMini" mode="aspectFill"></image>
    </template>

    <!-- 跳转网页 -->
    <template v-else-if="ad.type === 2">
      <!-- 判断广告位置 -->
      <image class="image" :src="ad.image" @click="toWeb" mode="aspectFill"></image>
    </template>

    <!-- 跳转流量主Banner -->
    <template v-else-if="ad.type === 3">
      <!-- 判断广告位置 -->
      <ad :unit-id="ad.adid" ad-intervals="30"></ad>
    </template>

    <!-- 跳转流量主视频 -->
    <template v-else-if="ad.type === 4">
      <ad :unit-id="ad.adid" ad-type="video" ad-theme="white"></ad>
    </template>

  </view>

</template>
<script>
export default {
  options: {
    virtualHost: true
  }
}
</script>
<script setup>

/* 传递的参数 */
const props = defineProps({
  config: {
    type: Object,
    required: true
  }
});


/**
 * 广告配置
 * @type {{
 *   show: boolean;
 *   type: number;
 *   adid: string;
 *   image: string;
 * }}
 */
const ad = props.config;

/* 跳转小程序 */
const toMini = () => {
  wx.navigateToMiniProgram({
    shortLink: ad.adid,
  })
}

/* 跳转web */
const toWeb = () => {
  wx.navigateTo({
    url: "/pages/web/web?type=" + encodeURIComponent(ad.adid)
  })
}
</script>

<style lang="scss" scoped>
.ad-item {
  display: flex;
  justify-content: center;
  margin: 14rpx 2.5vw 0 2.5vw;
  padding: 0 18rpx 10rpx 18rpx;
  width: 95vw;
  box-sizing: border-box;

  .image {
    min-height: 210rpx;
    height: 210rpx
  }
}
</style>