<template>

  <v-user v-if="!!$user.token && loaded">

    <v-mode v-if="box.mode"/>
    <v-batch/>
    <v-form/>
    <v-submit/>
    <v-ads :config="$sys.ad.config.preload"/>

  </v-user>
</template>

<script setup>
import {ref, watch} from 'vue'
import {share, loadBox} from '@/common/sys/box'
import {onShareAppMessage} from "@dcloudio/uni-app";
import step from "@/common/sys/step";
import {provides} from "@/common/util/common";
import VBatch from "./v-batch/v-batch.vue";
import VMode from "./v-mode/v-mode.vue";
import VForm from "./v-form/v-form.vue";
import VSubmit from "./v-submit/v-submit.vue";

/* 获取传递的ID */
const props = defineProps(['id']);

/* 待上传的文件 */
const files = ref([]);
/* 可上传的名单 */
const list = ref([]);

const {
  box, loaded
} = loadBox(props.id, 4)

/* 依赖注入 */
provides({
  /* 当前任务 */
  box,
  /* 是否批量 */
  batch: ref(true),
  /* 待上传 */
  files,
  /* 已上传 */
  finish: ref(0),
  /* 名单 */
  list
});

/* 任务加载完毕时触发 */
watch(() => loaded.value, () => {

  /* 需要提交的表单长度 */
  const length = box.value.mode ? box.value.regular.length : 1;

  /* 文件集合 */
  files.value = step.getFiles().map((item, index) => {

    /* 定义文件id */
    const form = {
      /* 文件ID */
      id: index,
      /* 文件名 */
      name: "",
      /* 原源文件名 */
      origin: item.fileName,
      /* 临时文件路径 */
      tempFile: item.tempPath,
      /* 上传进度 */
      progress: 0,
      /* 每个规则的命名 */
      info: [],
      /* 已上传的文件大小 */
      size: 0
    };


    /* 针对每个规则的 单独命名  组成的数组 */
    for (let k = 0; k < length; k++) {
      form.info.push("");
    }

    return form;
  })

  /* 如果是名单模式 */
  if (box.value.mode === 0 && !!box.value.list) {
    /* 移除特殊字符 */
    list.value = box.value.list.list.trim().split("\n").map(item => {
      /* 移除特殊字符 */
      return item.trim();
    })
  }


})

/* 分享时触发 */
onShareAppMessage(() => {

  share(box.value.id); //记录分享事件

  return {
    title: box.value.title,
    path: `/pages/collect/upload?id=${box.value.id}`
  }
})

</script>

<style lang="scss">

/* 公共样式 */
@import '@/assets/css/common.scss';

:deep(.task) {
  @include card($margin: 14rpx 2.5% 10rpx 2.5%, $padding: 20rpx 30rpx 20rpx 30rpx, $width: 95%);
  display: flex;
  flex-wrap: wrap;
  font-size: 13.5px;
  font-weight: 350;
  color: $text-6;

  .line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    margin: 10rpx 5rpx 10rpx 5rpx;

    /* 输入框之前的标签，强制不换行 */
    .label {
      width: 100%;
      color: #606266;
      text-align: left;
      font-size: 28rpx;
      margin: 10rpx 5rpx 10rpx 5rpx;
    }


    .downline {
      width: 100%;
      display: flex;
      margin: 10rpx 5rpx 25rpx 5rpx;
      justify-content: space-between;
      flex-wrap: nowrap;

      .combox {

        width: 100%;

        .uni-combox {
          border: none;
          border-bottom: #808388 1px solid;
          border-radius: 0;
        }
      }
    }

    /* 输入框的样式 */
    .textarea {
      width: 80%;
      font-size: 30rpx;
      font-weight: lighter;
      margin-right: 36rpx;
      padding: 0 15rpx 25rpx 15rpx;
      border-bottom: #808388 1px solid;
    }

    .number {
      color: #303133;
    }

    /* 输入框之前的小字 */
    .small {
      margin-top: 15rpx;
      font-size: 30rpx;
      color: #606266;
    }
  }

  .filename {
    flex-wrap: nowrap;
  }

  /* 红色的*号样式 */
  .red {
    color: red;
    margin-right: 5rpx;
  }


  .popup-text {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #303133;
    margin: 5rpx 1% 10rpx 1%;
    width: 98vw;
    font-size: 30rpx;
  }

  .popup-progress {
    margin: 0 1% 10px 1%;
    width: 98vw;
  }
}
</style>