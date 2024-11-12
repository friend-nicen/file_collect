<template>
  <v-user v-if="!!$user.token && loaded">
    <view class="task">

      <!--  顶部邀请信息    -->
      <view class="task-source">
        <image class="image" :src="avatar" mode="widthFix"/>
        <text class="nickname">{{ box.user.nickname }}</text>
        <text class="invite">邀请你提交</text>
      </view>

      <view class="task-title">
        {{ box.title }}
      </view>

      <view class="task-item">
        <view class="up">开始时间</view>
        <view class="down">
          {{ box.start_time }}
        </view>
      </view>

      <view class="task-item">
        <view class="up">截止时间</view>
        <view class="down">
          {{ box.end_time }}
        </view>
      </view>

      <view class="task-item">
        <view class="up">收纳箱类型</view>
        <view class="down">
          {{ box.type === 1 ? "图片收纳箱" : "文件收纳箱" }}
        </view>
      </view>

      <view class="task-item">
        <view class="up">任务状态</view>
        <view class="down">
          <uni-tag size="small" v-if="box.status === 1" :inverted="true" text="正在收集" type="success"/>
          <uni-tag size="small" v-else-if="box.status === 2" :inverted="true" text="已终止" type="error"/>
          <uni-tag size="small" v-else :inverted="true" text="已完成" type="warning"/>
        </view>
      </view>

      <view class="task-detail">
        <view class="up">任务说明</view>
        <view class="down"> {{ box.Instructions }}</view>
      </view>

    </view>

    <!--  邀请按钮  -->
    <view class="main-button">
      <button type="primary" open-type="share" style="background-color: #007aff;">
        <text class="iconfont icon-xiaoxi"></text>
        <text>邀请微信好友提交</text>
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
} = loadBox(props.id, 1);


/* 用户头像 */
const avatar = computed(() => {
  const creator = box.value.user.avatar;
  return creator.indexOf('http') > -1 ? creator : `${api.host}${creator}`
});


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
  font-size: 13.5px;
  font-weight: 350;
  color: $text-6;

  /* 任务的发起人信息 */
  .task-source {

    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin-bottom: 20rpx;
    font-size: 32rpx;

    .image {
      width: 10%;
      min-height: 60rpx;
      border-radius: 50%;
    }

    .nickname {
      margin-left: 20rpx;
    }

    .invite {
      color: #909399;
      margin-left: 5rpx;
    }
  }

  /* 任务的标题 */
  .task-title {
    text-align: center;
    padding: 20rpx 10rpx 30rpx 10rpx;
    width: 100%;
    font-size: 38rpx;
    border-bottom: $border-color-1 solid 1rpx;
  }

  /* 任务的到期时间 */
  .task-item {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding: 20rpx 0;
    border-bottom: $border-color-1 solid 1px;

    .up {
      font-size: 28rpx;
    }

    .down {
      color: #606266;
      font-weight: lighter;
    }
  }


  /* 任务的到期时间 */
  .task-detail {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    padding: 20rpx 0;
    border-bottom: $border-color-1 solid 1px;

    .up {
      width: 100%;
      font-size: 28rpx;
    }

    .down {
      margin-top: 20rpx;
      color: #606266;
      width: 100%;
      font-weight: lighter;
    }
  }

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
