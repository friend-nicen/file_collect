<template>
  <view class="task">
    <view class="task-title">
      {{ box.title }}
    </view>

    <view class="task-item">
      <view class="up">开始时间</view>
      <view class="down">
        {{ box.start_time }}
      </view>
    </view>

    <view class="task-item">
      <view class="up">截止时间</view>
      <view class="down">
        {{ box.end_time }}
      </view>
    </view>
    <view class="task-item">
      <view class="up">收纳箱类型</view>
      <view class="down">
        {{ box.type === 1 ? "图片收纳箱" : "文件收纳箱" }}
      </view>
    </view>
    <view class="task-item">
      <view class="up">任务状态</view>
      <view class="down">
        <uni-tag size="small" v-if="box.status === 1" :inverted="true" text="正在收集" type="success"/>
        <uni-tag size="small" v-else-if="box.status === 2" :inverted="true" text="已终止" type="error"/>
        <uni-tag size="small" v-else :inverted="true" text="已完成" type="warning"/>
      </view>
    </view>

    <view @click="open" v-if="box.permiss === 1" class="task-item task-line">
      <view class="label">文件提醒</view>
      <switch class="switch" :checked="box.notice" color="#2979FF"/>
    </view>

    <view @click="scribe" v-if="box.permiss === 1" class="task-item task-line">
      <view class="label">过期提醒</view>
      <switch class="switch" :checked="box.subscribe" color="#2979FF"/>
    </view>

    <view class="task-detail">
      <view class="up">任务说明</view>
      <view class="down">
        {{ box.Instructions }}
      </view>
    </view>
  </view>
</template>

<script setup>
import {inject} from "vue";
import load from "@/common/util/load";
import api from "@/service/api";

/* 注入盒子信息 */
const box = inject('box');
/* 注入盒子信息 */
const alert = inject('alert');
/* 打开设置页面 */
const open = () => {
  /* 弹出提醒 */
  load.confirm("打开事件推送后，有新文件上传时将会通过公众号给您推送消息提醒，是否继续该操作？", () => {
    try {
      /* 请求登录接口 */
      uni.request({
        url: `${api.notice}?box=${box.value.id}`,
        method: "GET"
      }).then((res) => {
        /* 如果登录成功！ */
        if (res.data.code) {
          /* 跳转界面，访问 */
          uni.navigateTo({
            url: `/pages/web/web?hide=1&url=${encodeURIComponent(res.data.data)}`
          })
        } else {
          load.error(res.data.errMsg); //弹出错误信息
        }

      }).catch(e => {
        console.log(e);
        load.error(e)
      }).finally(() => {
        load.loaded(0);
      });

    } catch (e) {
      console.log(e)
      load.error(e);
    }
  })
}

/* 订阅 */
const scribe = () => {
  if (!box.value.subscribe) {
    alert();
  } else {
    load.info("文件到期的消息提醒已经提交到微信，无法撤回哦")
  }
}
</script>

<style lang="scss" scoped>

/* 公共样式 */
@import '@/assets/css/common.scss';


.task {

  /* 任务的标题 */
  .task-title {
    text-align: center;
    padding: 20rpx 10rpx 30rpx 10rpx;
    width: 100%;
    font-size: 38rpx;
    border-bottom: $border-color-1 solid 1rpx;
  }

  /* 任务的到期时间 */
  .task-item {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: $border-color-1 solid 1px;
    width: 100%;
    padding: 20rpx 0;


    .up {
      font-size: 28rpx;
    }

    .down {
      color: #606266;
      font-weight: lighter;
    }

    /* 表单项 */
    .label {
      font-size: 28rpx;
    }

    .switch {
      position: absolute;
      right: 0;
      transform: scale(0.8);
      pointer-events: none;
    }

  }

  .task-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* 任务的到期时间 */
  .task-detail {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
    padding: 20rpx 0;
    border-bottom: $border-color-1 solid 1px;

    .up {
      width: 100%;
      font-size: 28rpx;
    }

    .down {
      margin-top: 20rpx;
      color: #606266;
      width: 100%;
      font-weight: lighter;
    }
  }

}


</style>
