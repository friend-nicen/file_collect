<template>

  <v-user v-if="!!$user.token" :notice="false" :share="false">

    <!--  有数据了才显示 -->
    <template #top v-if="type === '1'">
      <!-- 顶部选择器 -->
      <view class="fixed">
        <uni-segmented-control :activeTab="activeTab" :values="['按文件查看', '按名单查看','信息表格']"
                               style-type="button"
                               active-color="#007aff" @click-item="onClickItem"/>
      </view>
      <!-- 占位 -->
      <view class="place"/>
    </template>

    <!-- 列表 -->
    <view class="lists">
      <v-files :type="type" v-if="activeTab === 0"/>
      <v-logs v-if="activeTab === 1"/>
    </view>

    <!-- 广告位 -->
    <v-ads :config="$sys.ad.config.filelist"/>

  </v-user>

  <!-- 下载弹窗 -->
  <uni-popup ref="downDialog" :mask-click="false" background-color="#fff">
    <template v-if="waitHandle.data.file">

      <!-- 下载打包文件 -->
      <view class="popup-header">
        <text>预览文件</text>
        <uni-icons @click="()=>downDialog.close()" type="closeempty" color="#909399" size="21"></uni-icons>
      </view>

      <!-- 内容体 -->
      <view class="popup-content">

        <view class="popup-text">
          已下载：{{ (waitHandle.data.size / 1024 / 1024).toFixed(2) }}m / {{ waitHandle.data.file.file_size }}
        </view>

        <view class="popup-progress">
          <progress :percent="waitHandle.data.percent" show-info stroke-width="3"/>
        </view>

        <view class="main-button">


          <template v-if="waitHandle.data.loaded">
            <button style="background-color: #007aff;" @click="()=>open(waitHandle.data.tempPath)" class="mini-btn"
                    type="primary" size="mini">查看文件
            </button>

            <button style="margin-left:15px;background-color: #007aff;" @click="share"
                    class="mini-btn" type="primary" size="mini">转发保存
            </button>
          </template>

          <template v-else>
            <button type="primary"
                    :loading="waitHandle.data.loading"
                    @click="handle"
                    style="background-color: #007aff;">
              取消下载...
            </button>
          </template>

        </view>
      </view>
    </template>
  </uni-popup>


</template>
<script setup>
import {ref} from "vue";
import hook from "./hook";
import showSheet from './sheet'
import down from './down'
import VFiles from "./v-files/v-files.vue";
import VLogs from "./v-logs/v-logs.vue";
import {onShow, onUnload} from "@dcloudio/uni-app";
import {provides} from "@/common/util/common";
import open from "@/common/sys/open";


/* 属性 */
const props = defineProps(['id', 'type']);

/* 下载预览相关的功能 */
const {
  downDialog,
  waitHandle,
  handle,
  share
} = down();

/* 依赖注入 */
provides({
  box: props.id,
  type: props.type,
  downDialog,
  waitHandle,
  handle
})

/* 被选面板 */
const activeTab = ref(0); //被选面板


/* 选择面板 */
const onClickItem = (e) => {

  /* 如果是加载表格 */
  if (e.currentIndex === 2) {
    showSheet(props.id);
    return;
  }

  if (activeTab.value !== e.currentIndex) {
    activeTab.value = e.currentIndex
  }
};


/* 刷新数据 */
onShow(() => {
  if (hook.action) hook.action()
})

/* 清空钩子 */
onUnload(() => {
  hook.action = null
});

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

/* 中间内容面板 */
.lists {
  height: 100%;
  overflow: auto;
  padding: 0;
  margin: 10rpx 0 0 0;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}


:deep(.task) {

  @include card($margin: 14rpx 2.5% 10rpx 2.5%, $padding: 20rpx 30rpx, $width: 95%);

  display: flex;
  flex-wrap: wrap;
  font-size: 27rpx;
  font-weight: 350;
  color: #000000;

}


/* 底部无数据的提示样式 */
:deep(.end) {
  width: 100%;
  color: #8a8d93;
  text-align: center;
  margin-top: 38rpx;
  margin-bottom: 38rpx;
}


/* 弹窗的样式 */
.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  margin: 0;
  padding: 0 20rpx;
  box-sizing: border-box;
  background-color: #f7f7f7;
  height: 100rpx;
  color: #303133;
}

/* 上传进度显示面板 */
.popup-content {
  display: flex;
  align-items: stretch;
  align-content: space-between;
  flex-wrap: wrap;
  height: 360rpx;
  width: 100vw;

  /* 上传进度提示文文字 */
  .popup-text {
    color: #303133;
    margin: 48rpx 10% 15rpx 10%;
    width: 80vw;
  }

  /* 进度条 */
  .popup-progress {
    margin: 12rpx 10% 25rpx 10%;
    width: 80vw;
  }

  /* 下载按钮 */
  .main-button {
    width: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10rpx 10% 35rpx 10%;
    padding: 10rpx 24rpx 20rpx 24rpx;
  }
}


</style>