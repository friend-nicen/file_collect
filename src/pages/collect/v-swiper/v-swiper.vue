<template>

  <!-- 功能区 -->
  <view class="task">
    <view class="header">
      <view class="tab active" @click="swiperIndex=0">
        提交文件
      </view>
      <view class="tab" @click="$go('push',`/pages/task/lists/index?id=${box.id}&type=2`)">
        我的提交
      </view>
    </view>

    <swiper class="swiper" :style="{height:box.type === 2?'400rpx':'220rpx'}" :current="swiperIndex">
      <swiper-item class="swiper-item">
        <view class="action" @click="openWebview" v-if="box.type === 2">
          <image class="image" mode="widthFix" src="@/static/upload/file.png"/>
          <view class="this">任意文件</view>
        </view>

        <view class="action" @click="uploadLocal(1)" v-if="box.type === 2">
          <image class="image" mode="widthFix" src="@/static/collect/video.png"/>
          <view class="this">本地视频</view>
        </view>
        <view class="action" @click="uploadMessage">
          <image class="image" mode="widthFix" src="@/static/collect/wechat.png"/>
          <view class="this">{{ box.type === 2 ? "聊天文件" : "聊天图片" }}</view>
        </view>
        <view class="action" @click="uploadLocal(0)">
          <image class="image" mode="widthFix" src="@/static/upload/photo.png"/>
          <view class="this">本地相册</view>
        </view>
        <view class="action" @click="openWebview" v-if="box.type === 2">
          <image class="image" mode="widthFix" src="@/static/upload/excel.png"/>
          <view class="this">表格文档</view>
        </view>
        <view class="action" @click="openWebview" v-if="box.type === 2">
          <image class="image" mode="widthFix" src="@/static/upload/package.png"/>
          <view class="this">压缩包</view>
        </view>

      </swiper-item>
    </swiper>
  </view>


</template>

<script setup>

import {inject, ref} from "vue";
import load from "@/common/util/load";
import initSys from '@/store/system'
import initUser from '@/store/user'
import {MToByte} from "@/common/util/common";
import step from '@/common/sys/step';


/* 被选的swiper */
const swiperIndex = ref(0);
const box = inject('box');
const system = initSys();
const user = initUser();

/* 最大文件大小 */
const Max = system.env.max;
const max = MToByte(Max);

/* 是否已经结束收集 */
const isEnd = () => {
  if (box.value.status === 2 || box.value.status === 3) {
    load.error("收集任务已经停止了，不能提交文件了哦！")
    return true;
  }
  return false;
}

/* 跳转上传 */
const next = () => {
  /* 跳转到第二步上传 */
  uni.navigateTo({
    url: "/pages/task/next/index?id=" + box.value.id
  })
}

/* 从聊天文件上传 */
const uploadMessage = () => {

  /* 判断是否结束 */
  if (isEnd()) return;

  /* 判断是否为手机 */
  if (!system.device.isMobile) {
    load.error("电脑端的小程序不支持这个操作哦，还请通过手机端进行选择~！");
    return;
  }

  /* 从聊天中选择文件 */
  uni.chooseMessageFile({
    /* 可选文件类型 */
    type: box.value.type === 1 ? 'image' : 'all',
    success: function (res) {

      const files = [];

      /* 遍历所有文件 */
      let count = 1;

      for (let i of res.tempFiles) {

        if (i.size > max) {
          load.error(`第${count}个文件的大小超过${Max}m，无法上传哦！"`);
          return;
        } else {
          files.push({
            fileName: !!i.name ? i.name : null,
            tempPath: i.path
          });
        }

        count++;
      }


      /* 存在文件 */
      if (files.length) {
        step.setFiles(files); //保存文件到全局
        next();//跳转下一步
      }


    },
    fail: function (e) {
      load.error(e);
    }
  });

}

/* 从本地文件选择上传 */
const uploadLocal = (type) => {
  /* 判断是否结束 */
  if (isEnd()) return;

  /* 处理函数 */
  const handle = {
    success(res) {

      const files = [];

      /* 遍历所有文件 */
      let count = 1;

      for (let i of res.tempFiles) {

        if (i.size > max) {
          load.error(`第${count}个文件的大小超过${Max}m，无法上传哦！"`);
          return;
        } else {
          files.push({
            fileName: null,
            tempPath: i.tempFilePath
          });
        }

        count++;
      }

      /* 存在文件 */
      if (files.length) {
        step.setFiles(files); //保存文件到全局
        next();//跳转下一步
      }


    },
    fail: function (e) {
      console.log(e)
      load.error(e);
    }
  }


  /* 是否能使用新接口 */
  if (wx.canIUse("chooseMedia")) {

    /* 类型 */
    const types = [['image'], ['video']][type];

    /* 选择文件 */
    uni.chooseMedia(Object.assign({
      count: 20,
      mediaType: types,
      sourceType: ['album', 'camera'],
      camera: 'back',
    }, handle))


  } else {

    /* 回退到旧API */
    if (type === 1) {
      /* 选择视频 */
      uni.chooseVideo({
        sourceType: ['camera', 'album'],
        success: function (res) {
          handle.success({
            tempFiles: [res]
          });
        },
        fail: handle.fail
      });
    } else {
      /* 选择图片 */
      uni.chooseImage({
        success: function (res) {

          /* 格式处理 */
          res.tempFiles = res.tempFiles.map((item) => {
            return {
              size: item.size,
              tempFilePath: item.path
            }
          })

          /* 提交到处理器 */
          handle.success(res);
        },
        fail: handle.fail
      });
    }

  }


}


/* 跳转文件上传的webview */
const openWebview = () => {

  /* 判断是否结束 */
  if (isEnd()) return;

  /* 上传地址 */
  const link = system.env.webview.upload;
  const webview = encodeURIComponent(`${link}?token=${user.token}&box=${box.value.id}`);

  /* 跳转上传 */
  uni.navigateTo({
    url: '/pages/web/web?url=' + webview + "&t=" + (new Date()).getTime()
  })

}
</script>

<style lang="scss" scoped>
.task {
  padding-bottom: 0rpx;
  margin-bottom: 25rpx;

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
      width: 50%;
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
      justify-content: space-around;
      align-items: flex-start;
      flex-wrap: wrap;

      width: 100%;
      box-sizing: border-box;

      /* 轮播项面板 */
      .action {

        display: flex;
        align-items: center;
        justify-content: center;
        align-content: center;
        flex-wrap: wrap;
        width: 33.3%;
        margin: 10rpx 0;
        border-radius: 50%;

        .image {
          width: 35%;
          min-height: 70rpx;
        }

        .this {
          margin-top: 27rpx;
          width: 100%;
          text-align: center;
        }
      }

    }
  }


}
</style>
