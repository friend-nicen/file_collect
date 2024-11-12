<template>
  <view class="footer">
    <button class="contact" open-type="contact">联系客服</button>
  </view>
</template>

<script setup="">

</script>

<style lang="scss" scoped>

@import '@/assets/css/common.scss';

/* 底部联系客服*/
.footer {
  width: 100%;
  text-align: center;
  margin-top: 38rpx;
  margin-bottom: 38rpx;

  /* 按钮的样式 */
  .contact {
    background-color: transparent;
    color: #007aff;
    font-weight: lighter;
    font-size: $font-size-2;

    /* 取消边框 */
    &::after {
      border: none;
    }
  }
}

</style>
