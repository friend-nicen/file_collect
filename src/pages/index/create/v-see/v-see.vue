<template>
  <view class="card">

    <!-- 文件重命名开关 -->
    <view class="line see">
      <view class="line-left">

        <view class="label">提交者可查看已上传文件和名单</view>

        <view class="small">
          <text class="blue">[当前]</text>
          <text class="rule">{{ box.visible ? '所有提交者' : '只有你' }}可查看</text>
        </view>
      </view>

      <switch :checked="box.visible" color="#2979FF" @change="box.visible=box.visible?0:1"/>

    </view>
  </view>

</template>

<script setup>
import {inject} from "vue";

const box = inject("box");

</script>

<style lang="scss" scoped>
.card {
  padding-bottom: 25rpx;

  .see {

    align-items: center;

    .line-left {
      padding-right: 30rpx;

      .small {
        margin-bottom: 0;
      }
    }

  }

}
</style>
