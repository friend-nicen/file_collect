<template>
  <view class="user-container">
    <!-- 顶部内容区域  -->
    <slot name="top"/>
    <!-- 公告  -->
    <v-notice v-if="notice"/>
    <slot/>
  </view>
</template>
<script setup>
import VNotice from "#/v-notice/v-notice.vue";

/* 自定义属性 */
const props = defineProps({
  share: {
    required: false,
    default: true
  },
  notice: {
    required: false,
    default: true
  },
})


/* 是否可以分享 */
if (props.share) {
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
}


</script>

<style lang="scss" scoped>

.user-container {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100vh;
  width: 100vw;
  margin: 0;
}

</style>