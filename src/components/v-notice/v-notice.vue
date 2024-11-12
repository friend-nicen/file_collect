<template>
  <view class="notice">
    <uni-notice-bar :showIcon="true" :speed="speed" :showClose="false" :scrollable="true" :single="true"
                    :text="board?board:$sys.env.board"/>
  </view>
</template>

<script setup>
defineProps({
  board: {
    default: null
  },
  speed: {
    default: 100
  }
})
</script>


<style scoped lang="scss">
:deep(.notice) {
  width: 100%;
  overflow: hidden;

  .uni-noticebar-icon {
    max-height: 22px;
  }
}
</style>
