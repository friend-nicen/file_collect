<template>
  <view class="main-button">
    <button type="primary" @click="upload" :loading="loading" style="background-color: #007aff;">
      <text v-if="!loading" class="iconfont icon-xiaoxi"></text>
      <text>{{ loading ? "正在上传..." : "开始上传" }}</text>
    </button>
  </view>
</template>

<script setup>
import {computed, ref} from "vue";
import api from "@/service/api";
import insertAd from "@/common/ad/insert";
import {delay, injects} from "@/common/util/common";
import load from "@/common/util/load";
import initSys from "@/store/system.js"

/* 系统配置 */
const system = initSys();

/* 是否展示广告 */
const showInsert = computed(() => {
  /* 全局显示广告、显示插屏广告、显示任务广告 */
  return system.ad.config.insert.show && system.ad.show && system.ad.box;
});


/* 正在上传 */
const loading = ref(false);

/* 注入响应式变量 */
const {box, batch, files, finish, list} = injects(['box', 'batch', 'files', 'finish', 'list']);

/* 插屏广告 */
const insert = showInsert.value ? insertAd() : null;

/* 开始上传 */
const upload = () => {

  /* 正在上传 */
  if (loading.value) return;

  /* 是否上传完了 */
  if (finish.value === files.value.length) {
    load.info("当前文件已经全部上传完毕！无需再次上传！");
    return;
  }

  /* 检查表单项是否都填了 */
  /* 是不是批量的 */
  if (batch.value) {


    for (let k = 0; k < files.value[0].info.length; k++) {


      let info = files.value[0].info[k].trim();

      if (!info) {
        load.error("所有数据都必须填写")
        return;
      }

      files.value[0].info[k] = info;

      /* 名单模式下的筛选 */
      if ((!box.value.mode)) {

        if (list.value.indexOf(info) === -1) {
          load.error(info + "不在允许上传文件的名单内!")
          return;
        }

      }


    }


  } else {

    /* 数据校验 */
    for (let i = 0; i < files.value.length; i++) {

      /* 校验内部 */
      for (let k = 0; k < files.value[i].info.length; k++) {

        let info = files.value[i].info[k].trim();

        if (!info) {
          load.error("所有数据都必须填写")
          return;
        }

        files.value[i].info[k] = info;

      }

    }
  }


  /* 按钮加载效果 */
  loading.value = true;

  /* 开始上传所有文件 */
  for (let i = 0; i < files.value.length; i++) {

    let file = files.value[i];


    /* 文件上传 */
    const uploadTask = uni.uploadFile({
      /* 文件上传接口 */
      url: `${api.upload}?box=${box.value.id}`, //仅为示例，非真实的接口地址
      filePath: file.tempFile,
      name: 'file',
      formData: {
        /* 填写的信息 */
        'info': JSON.stringify(batch.value ? files.value[0].info : file.info),
        /* 源文件名 */
        'origin': !!file.origin ? file.origin : "",
        /* 文件序列 */
        'number': i
      },
      success: (res) => {


        /* 已上传文件数加1 */
        finish.value++;


        /* 如果上传失败 */
        if (!res.data.code) {

          /* 重置 */
          finish.value--;
          loading.value = false;

          /* 关闭上传动态 */
          load.loaded();

          /* 进度条减0 */
          files.value[i].progress = 0;
          files.value[i].size = 0;

          /* 弹窗说明 */
          load.error("文件" + (i + 1) + "上传失败，" + res.data.errMsg);
        }


        /* 判断文件已上传数量，是否全部上传完毕 */
        if (files.value.length === finish.value) {

          /* 显示上传ok */
          loading.value = false;

          /* 关闭上传动态 */
          load.loaded();
          /* 上传成功提示 */
          load.info(res.data.errMsg)

          /* 延时执行，弹出插屏广告 */
          if (insert) {
            delay(insert, 1000)
          }

        }

      },
      /* 上传失败 */
      fail: function (e) {
        load.error(e); //显示上传失败
        loading.value = false;//关闭上传动态
      }
    });

    /* 更新上传的进度 */
    uploadTask.onProgressUpdate((res) => {
      files.value[i].progress = res.progress;
      files.value[i].size = res.totalBytesSent;
    });


  }


}

</script>

<style lang="scss" scoped>
/* 底部分享按钮 */
.main-button {
  width: 100%;
  margin: 36rpx 5rpx 25rpx 5rpx;
  padding: 10rpx 24rpx 5rpx 24rpx;

  .iconfont {
    font-size: 36rpx;
    margin-right: 15rpx
  }
}
</style>
