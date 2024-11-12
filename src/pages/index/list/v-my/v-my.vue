<template>
  <!-- 遍历自己创建的盒子 -->
  <view class="card" hover-class="hover" v-for="(item) of box" :key="item.id"
        @click="$go('push',`/pages/task/collect/index?id=${item.id}`)">

    <view class="box-title">
      <text>{{ item.title }}</text>
      <text class="level">{{ type[item.type - 1] }}</text>
    </view>

    <view class="box-number">
      已提交：{{ item.count }}份 共{{ item.person }}人
    </view>

    <view class="box-datetime">
      <view class="up">截止时间：{{ item.end_time }}</view>
      <view class="down">
        <uni-tag size="mini" v-if="item.status===1" :inverted="true" text="正在收集" type="success"/>
        <uni-tag size="mini" v-else-if="item.status===2" :inverted="true" text="已终止" type="error"/>
        <uni-tag size="mini" v-else :inverted="true" text="已完成" type="warning"/>
      </view>
    </view>

  </view>

  <view class="end" v-if="loaded">已经到底了</view>

</template>

<script setup>

import initData from './init'

const {
  loaded,
  type,
  box
} = initData();

</script>
