<template>

  <!-- 功能区 -->
  <view class="task">
    <view class="header">
      <view class="tab" :class="{active:swiperIndex === 0}" @click="changeSwiper(0)">
        邀请好友提交
      </view>
      <view class="tab" :class="{active:swiperIndex === 1}" @click="changeSwiper(1)">
        文件管理
      </view>
      <view class="tab" :class="{active:swiperIndex === 2}" @click="changeSwiper(2)">
        任务管理
      </view>
    </view>

    <swiper class="swiper" :style="{height:height}" :current="swiperIndex">
      <swiper-item class="swiper-item">
        <v-invite/>
      </swiper-item>
      <swiper-item class="swiper-item">
        <v-file/>
      </swiper-item>
      <swiper-item class="swiper-item">
        <v-task/>
      </swiper-item>
    </swiper>
  </view>


  <!-- 输入框示例 -->
  <uni-popup ref="inputDialog" type="dialog" :animation="false">
    <uni-popup-dialog ref="inputClose" mode="input" title="礼轻情意重!" placeholder="随便输一个金额 =.= ~"
                      @confirm="donateMoney"></uni-popup-dialog>
  </uni-popup>


  <!-- 普通弹窗 -->
  <uni-popup ref="downDialog" :mask-click="false" background-color="#fff">
    <!-- 下载打包文件 -->
    <view class="popup-header">
      <text>预览文件</text>
      <uni-icons @click="()=>downDialog.close()" type="closeempty" color="#909399" size="21"></uni-icons>
    </view>

    <!-- 内容体 -->
    <view class="popup-content">

      <view class="popup-text">
        已下载：{{ size }}m / {{ total }}m
      </view>

      <view class="popup-progress">
        <progress :percent="waitHandle.data.percent" show-info stroke-width="3"/>
      </view>

      <view class="main-button">

        <button type="primary"
                :loading="waitHandle.data.loading"
                @click="handle"
                style="background-color: #007aff;">
          {{ btnText }}
        </button>

      </view>
    </view>
  </uni-popup>


  <!-- 时间日期选择 -->
  <uni-datetime-picker ref="refSelectRange"
                       @change="startDown"
                       start-placeholder="开始时间"
                       end-placeholder="结束时间"
                       v-model="selectRange"
                       :start="disableDatetime.start"
                       :end="disableDatetime.end"
                       type="datetimerange"
                       rangeSeparator="至">
    <template #default></template>
  </uni-datetime-picker>

</template>

<script setup>
import VInvite from "./v-invite/v-invite.vue";
import VFile from "./v-file/v-file.vue";
import VTask from "./v-task/v-task.vue";
import {inject, ref} from "vue";
import load from "@/common/util/load";
import {provides} from "@/common/util/common";
import donate from "@/common/sys/donate";
import initDown from './down'


/* 文件下载 */
const {
  downDialog,
  waitHandle,
  openDialog,
  handle,
  share,
  btnText,
  size,
  total,
  selectRange,
  refSelectRange,
  disableDatetime,
  startDown

} = initDown();


/* 被选的swiper */
const swiperIndex = ref(0);
const box = inject('box');


/* 高度 */
const height = ref("400rpx");

/* 选择swiper */
const changeSwiper = (index) => {
  /* 动态改变滑片的高度 */
  if ((index === 2 && box.value.permiss === 1) || index === 0) {
    height.value = "400rpx";
  } else {
    height.value = "220rpx";
  }
  /* 变更 */
  swiperIndex.value = index;
}


/* 捐赠 */
const inputDialog = ref(null);

/**
 * 发起捐赠
 * @param money
 */
const donateMoney = (money) => {

  /* 判断金额 */
  if (!/^\d+\.?\d*$/.test(money)) {
    load.error("这个金额格式不对哦")
    return;
  }

  let fee = parseFloat(money);

  if (fee <= 0) {
    load.error("这个金额格式不对哦")
    return;
  }

  /* 调用赞助的方法 */
  donate(fee, "赞助成功，感谢您的支持！");

};


/* 批量注入 */
provides({
  swiperIndex,
  inputDialog,
  openDialog
})

</script>

<style lang="scss" scoped>
.task {
  padding-bottom: 0rpx;
  margin-bottom: 45rpx;


  /* 底部功能面板 */
  .header {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    width: 100%;

    /* 功能选择按钮 */
    .tab {
      display: flex;
      justify-content: center;
      width: 33%;
      box-sizing: border-box;
      margin: 0;
      padding: 15rpx 15rpx 30rpx 15rpx;
      border-bottom: #dee4eb solid 1px;
    }

    /* 被选中的功能面板 */
    .active {
      color: #2979FF;
      border-bottom: #2979FF solid 1px;
    }
  }

  /* 轮播组件 */
  .swiper {
    display: block;
    box-sizing: border-box;
    width: 100%;
    padding: 30rpx 0 5rpx 0;

    /* 轮播项面板 */
    .swiper-item {

      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-wrap: wrap;

      width: 100%;
      box-sizing: border-box;

    }
  }
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

</style>
