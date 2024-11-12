<template>
  <view class="task" @click="$go('push',`/pages/task/lists/index?id=${box.id}&type=1`)">
    <!-- 已经提交的人数统计 -->
    <view class="line">

      <view class="label">
        <view class="up">查看已提交文件、人员名单</view>
        <view class="down">
          <text style="color: #007AFF;">[当前]&nbsp;</text>
          <text>{{ !box.visible ? "该内容仅你可见" : "所有人可查看管理员可删除" }}</text>
        </view>
      </view>

      <view class="count">
        <text>{{ box.count }}份 共{{ box.person }}人
        </text>
        <uni-icons type="right" size="20" style="margin-bottom: -4rpx;" color="#2979FF"></uni-icons>
      </view>

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

      .up {
        font-size: 30rpx;
        margin-bottom: 6px;
      }
    }

    .count {
      display: flex;
      align-items: center;
      white-space: nowrap;
    }
  }
}


</style>
