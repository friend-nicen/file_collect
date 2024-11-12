<template>
  <!-- 文件批量重命名开关 -->
  <view class="task">
    <view class="line">
      <view class="batch">
        <view class="label">
          <text class="iconfont icon-bianji"></text>
          <text>{{ batch ? "已开启" : "已关闭" }}批量重命名所有文件</text>
        </view>
      </view>
      <switch style="align-self: flex-start" color="#2979FF" checked @change="batch=!batch"/>
    </view>
  </view>
</template>

<script setup="">
import {injects} from "@/common/util/common";

const {box, batch} = injects(['box', 'batch']);
</script>

<style lang="scss" scoped>

.task {
  padding-top: 8rpx;

  .batch {
    padding-right: 30rpx;

    .label {

      font-size: 32rpx;

      .iconfont {
        margin-right: 15rpx
      }
    }
  }
}
</style>
