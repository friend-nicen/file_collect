<template>

  <template v-for="(user,i) in files" :key="i">

    <view class="task">
      <view class="task-source">
        <image class="image" :src="user.avatar" mode="widthFix"></image>
        <text class="nickname">{{ user.nickname }}</text>
        <text class="plain">已上传文件：</text>
      </view>
    </view>

    <view class="task" v-for="(file,k) in user.data" :key="file.id">

      <view class="line">
        <view class="label">
          <text class="iconfont icon-wenjian"></text>
          <text class="wrap">{{ file.file_name }}.{{ file.file_ext }}（{{
              file.file_size ? file.file_size : "0.5m"
            }}）
          </text>
        </view>
      </view>

      <view class="popup-text">
        <text>上传时间：{{ file.upload_time }}</text>
        <view class="action">
          <text @click="preview(i,k)">预览</text>
          <text class="delete" @click="remove(i,k)">删除</text>
        </view>
      </view>

    </view>
  </template>

  <view class="end" v-if="loaded">已经到底了</view>


  <!-- 视频预览 -->
  <uni-popup @change="destroy" ref="videoDialog" background-color="#fff">
    <video v-if="!!video" id="myVideo" :src="`${host}${video}`" controls/>
  </uni-popup>


</template>

<script setup>

import {injects} from "@/common/util/common";
import initSys from '@/store/system'
import initData from './init'
import {ref} from "vue";
import load from "@/common/util/load";
import api from "@/service/api";


/* 注入数据 */
const {
  box,
  type,
  handle,
  waitHandle,
  downDialog
} = injects(['box', 'type', 'handle', 'waitHandle', 'downDialog']);

/* 系统配置 */
/** @type AppConfiguration */
const sys = initSys();
/* 预览地址 */
const host = sys.env.preview;
/* 视频播放地址 */
const video = ref("");
/* 视频播放弹出框 */
const videoDialog = ref(null);


/* 初始化数据 */
const {
  loaded,
  files
} = initData(box, type);


/* 文件预预览 */
const preview = (i, k) => {

  const Extensions = ['mp4', 'mov', 'avi', 'mkv']; // 常见视频格式的扩展名
  const file = files.value[i].data[k]; //被选文件
  const ext = !file.file_ext ? "" : file.file_ext.toLowerCase(); //转小写

  /* 判断是否是视频文件，弹出在线播放 */
  if (Extensions.indexOf(ext) > -1) {

    /* 弹出操作选项 */
    uni.showActionSheet({
      itemList: ['下载', '播放'],
      success: function (res) {

        /* 如果选择下载 */
        if (!res.tapIndex) {

          waitHandle.reset(); //重置数据
          waitHandle.data.file = file;
          downDialog.value.open("bottom");
          handle(); //开始下载

        } else {

          /* 弹出视频播放 */
          video.value = file.file_url;
          videoDialog.value.open("center");

        }

      },
      fail: function (e) {
        load.error(e)
      }
    });


  } else {
    waitHandle.reset(); //重置数据
    waitHandle.data.file = file;
    downDialog.value.open("bottom");
    handle(); //开始下载
  }

}


/* 关闭视频播放时触发 */
const destroy = (e) => {
  if (!e.show) video.value = "";
}


/* 删除文件 */
const remove = (i, k) => {

  const file = files.value[i].data[k]; //被选文件

  load.confirm("文件删除后无法恢复，确定继续吗？", () => {
    try {
      /* 显示加载状态 */
      load.loading("加载中...");
      /* 请求登录接口 */
      uni.request({
        url: `${api.remove}?box=${box}&file=${file.id}`,
        method: "GET"
      }).then((res) => {

        /* 如果登录成功！ */
        if (res.data.code) {
          files.value[i].data.splice(k, 1); //删除文件
        } else {
          load.error(res.data.errMsg); //弹出错误信息
        }

      }).catch(e => {
        console.log(e);
        load.error(e)
      }).finally(() => {
        load.loaded(); //加载完毕
      });

    } catch (e) {
      console.log(e)
      load.error(e);
    }
  })
}


</script>


<style scoped lang="scss">
@import "@/assets/css/common.scss";
/* 主界面 */
.task {

  /* 昵称 */
  .nickname {
    margin-left: 20rpx;
  }

  .plain {
    color: #909399;
  }


  /* 表单项 */
  .line {

    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin: 10rpx 5rpx 10rpx 5rpx;
    width: 100%;

    /* 输入框之前的标签，强制不换行 */
    .label {
      width: 100%;
      color: #606266;
      text-align: left;
      font-size: 28rpx;
      margin: 10rpx 15rpx 10rpx 5rpx;
      word-wrap: break-word;
      word-spacing: normal;

      .wrap {
        @include wrap;
      }

      .iconfont {
        margin-right: 15rpx;
      }
    }


    .downline {
      width: 100%;
      display: flex;
      margin: 10rpx 5rpx 25rpx 5rpx;
      justify-content: space-between;
      flex-wrap: nowrap;
    }


    /* 输入框之前的小字 */
    .small {
      margin-top: 15rpx;
      font-size: 30rpx;
      color: #606266;
    }


  }

  .popup-text {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #303133;
    margin: 5rpx 1% 10rpx 1%;
    width: 98vw;
    font-size: 30rpx;

    .action {
      color: #2979FF;
      cursor: pointer;

      .delete {
        margin-left: 8px;
      }
    }

  }

  /* 任务的发起人信息 */
  .task-source {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    margin-bottom: 2rpx;
    font-size: 32rpx;

    .image {
      width: 10%;
      min-height: 68rpx;
      border-radius: 50%;
      border: 1px solid #bfc3cb;
    }
  }
}


</style>
