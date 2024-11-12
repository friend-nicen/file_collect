<template>

  <template v-for="(item,i) in files" :key="i">

    <view class="task">
      <text class="wrap">
        {{ (i + 1) }}. {{ item.nickname }}
        <text class="gray">在{{ item.upload_time }}上传了文件[{{ item.file_name }}.{{ item.file_ext }}]！</text>
      </text>
    </view>

  </template>

  <view class="end" v-if="loaded">已经到底了</view>


</template>

<script setup>

import {injects} from "@/common/util/common";
import initData from './init'

/* 注入数据 */
const {box, type} = injects(['box', 'type']);

/* 初始化数据 */
const {
  loaded,
  files
} = initData(box, type);

</script>


<style scoped lang="scss">

@import "@/assets/css/common.scss";
/* 主界面 */
.task {

  .wrap {
    @include wrap;
    line-height: 1.5;

    .gray {
      color: #606266;
    }
  }

}
</style>
