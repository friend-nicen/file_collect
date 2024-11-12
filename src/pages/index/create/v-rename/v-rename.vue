<template>
  <view class="card">

    <!-- 文件重命名开关 -->
    <view class="line see">
      <view class="line-left">

        <view class="label">按照填写的信息重命名文件</view>

        <view class="small">
          <text class="blue">[当前]</text>
          <text class="rule">{{ box.rename ? '自动重命名' : '保留文件名' }}</text>
        </view>
      </view>

      <switch :checked="box.rename" color="#2979FF" @change="change"/>

    </view>
  </view>

</template>

<script setup>
import {inject} from "vue";
import load from "@/common/util/load";

const box = inject("box");
let noticed = 0; //未提示

/* 改变命名规则 */
const change = () => {
  /* 是否需要提醒 */
  if (box.value.rename && !noticed) {
    noticed = 1; //标记已提醒
    load.info("由于微信小程序规则限制，如您关闭自动重命名，上传文件的时候只能选择【任意文件】的方式上传才能保留原文件名。如您有任何疑问请联系客服")
  }
  /* 调整模式 */
  box.value.rename = box.value.rename ? 0 : 1;

}

</script>

<style lang="scss" scoped>
.card {
  padding-bottom: 25 rpx;

  .see {

    align-items: center;

    .line-left {
      padding-right: 30 rpx;

      .small {
        margin-bottom: 0;
      }
    }

  }

}
</style>
