<template>
  <v-user v-if="!!$user.token && loaded">

    <view class="task title">
      {{ box.title }}
    </view>

    <view class="task">
      您正在向好友共享收纳箱，共享之后您的好友将获得该任务的文件管理、名单查看等权限。好友接受共享之后，本次共享自动失效，您确定继续吗？
    </view>

    <view class="main-button">
      <button type="primary" open-type="share" style="background-color: #007aff;">
        <text class="iconfont icon-xiaoxi"></text>
        <text>邀请好友共同管理</text>
      </button>
    </view>

  </v-user>
</template>

<script setup>

import {share, loadBox} from '@/common/sys/box'
import {onShareAppMessage} from '@dcloudio/uni-app'

/* 获取传递的ID */
const props = defineProps(['id']);

/* 初始化任务信息 */
const {
  box, loaded
} = loadBox(props.id, 1);


/* 分享时触发 */
onShareAppMessage(() => {

  share(box.value.id, 2); //记录分享事件

  return {
    title: box.value.title,
    path: `/pages/share/apply?id=${box.value.id}`
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
