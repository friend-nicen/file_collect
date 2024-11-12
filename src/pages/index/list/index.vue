<template>

  <v-user v-if="!!$user.token">

    <!--  有数据了才显示 -->
    <template #top>
      <!-- 顶部选择器 -->
      <view class="fixed">
        <uni-segmented-control :activeTab="activeTab" :values="['我管理的', '我使用的']" style-type="button"
                               active-color="#007aff" @click-item="onClickItem"/>
      </view>
      <!-- 占位 -->
      <view class="place"/>
    </template>

    <v-my v-if="activeTab === 0"/>
    <v-used v-if="activeTab === 1"/>

  </v-user>

</template>
<script setup>
import {ref} from "vue";
import hook from './hook'
import VUsed from "./v-used/v-used.vue";
import VMy from "./v-my/v-my.vue";
import {onShow} from "@dcloudio/uni-app";

/* 被选面板 */
const activeTab = ref(0);

/* 选择面板 */
const onClickItem = (e) => {
  if (activeTab.value !== e.currentIndex) {
    activeTab.value = e.currentIndex
  }
};


/* 刷新数据 */
onShow(() => {
  if (hook.action) hook.action()
})

</script>

<style lang="scss" scoped>
/* 公共样式 */
@import '@/assets/css/common.scss';


.place {
  height: 45px;
  width: 100%;
}

.fixed {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1024;
  width: 100%;

  /* 选项面板的切换按钮 */
  .control {
    width: 100%;
  }
}


:deep(.card) {

  @include card($margin: 10rpx 2.5% 22rpx 2.5%, $padding: 36rpx 24rpx, $width: 95%);

  display: flex;
  flex-wrap: wrap;
  font-size: 27rpx;
  font-weight: 350;
  color: #000000;


  /* 任务的标题 */
  .box-title {
    width: 100%;
    text-align: left;
    margin-bottom: 25rpx;
    font-size: 32rpx;
    display: flex;
    align-items: center;
    align-content: center;
    justify-content: space-between;

    /* 盒子类型样式 */
    .level {
      margin-right: 5px;
      padding: 2px 8px;
      background-color: #4CD964;
      border-radius: 15rpx;
      font-size: 20rpx;
      color: #ffffff;
      font-weight: bold;
      margin-left: 20rpx;
      white-space: nowrap;
    }

  }

  /* 任务的完成人数 */
  .box-number {
    width: 100%;
    text-align: left;
    margin-bottom: 25rpx;
    font-weight: lighter;
    color: #606266;
  }

  /* 任务的到期时间 */
  .box-datetime {
    display: flex;
    width: 100%;
    justify-content: space-between;
    color: #606266;

    .up {
      font-weight: lighter;
    }

    /* 下方的文字样式 */
    .down {
      margin-right: 5px;
    }
  }


}


/* 底部无数据的提示样式 */
:deep(.end) {
  width: 100%;
  color: #8a8d93;
  text-align: center;
  margin-top: 38rpx;
  margin-bottom: 38rpx;
}


</style>