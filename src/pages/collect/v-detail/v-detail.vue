<template>
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

    <view @click="scribe" class="task-item task-line">
      <view class="label">结束提醒</view>
      <switch class="switch" :checked="box.subscribe" color="#2979FF"/>
    </view>

    <view class="task-detail">
      <view class="up">任务说明</view>
      <view class="down"> {{ box.Instructions }}</view>
    </view>

  </view>
</template>

<script setup>
import {computed, inject} from "vue";
import api from "@/service/api";
import load from "@/common/util/load";

/* 注入盒子信息 */
const box = inject('box');
const alert = inject('alert');

/* 用户头像 */
const avatar = computed(() => {
  const creator = box.value.user.avatar;
  return creator.indexOf('http') > -1 ? creator : `${api.host}${creator}`
});


/* 订阅 */
const scribe = () => {
  if (!box.value.subscribe) {
    alert(true);
  } else {
    load.info("任务结束的消息提醒已经提交到微信，无法撤回哦")
  }
}
</script>

<style lang="scss" scoped>

/* 公共样式 */
@import '@/assets/css/common.scss';


.task {

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
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: $border-color-1 solid 1px;
    width: 100%;
    padding: 20rpx 0;


    .up {
      font-size: 28rpx;
    }

    .down {
      color: #606266;
      font-weight: lighter;
    }


    /* 表单项 */
    .label {
      font-size: 28rpx;
    }

    .switch {
      position: absolute;
      right: 0;
      transform: scale(0.8);
      pointer-events: none;
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


</style>
