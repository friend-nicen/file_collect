<template>
  <view class="card">

    <!--文件收纳箱基本信息  -->

    <view class="line">

      <view class="label">收集标题
        <text class="red">*</text>
      </view>

      <input placeholder-class="placeholder"
             :maxlength="$sys.env.number.title"
             class="input"
             type="text"
             placeholder="如XXX活动参与截图"
             v-model="box.title"/>
      <text style="color: #606266;">
        {{ box.title.length }}/{{ $sys.env.number.title }}
      </text>

    </view>

    <view class="line start">

      <view class="label">收集说明
        <text class="red">*</text>
      </view>

      <view class="area">

        <textarea
            class="textarea"
            placeholder-class="placeholder"
            v-model="box.Instructions"
            :maxlength="$sys.env.number.instruction"
            placeholder="告诉他人所要收集的内容,或者提交文件格式和命名规范等"/>

        <text class="number">
          {{ box.Instructions.length }}/{{ $sys.env.number.instruction }}
        </text>

      </view>
    </view>

  </view>

</template>

<script setup="">
import {inject} from "vue";

const box = inject("box");

</script>

<style lang="scss" scoped>

.card {

  .start {
    align-items: flex-start;
  }

  .line {


    .area {
      width: 100%;
      padding-top: 5rpx;
      position: relative;

      /* 文本输入框样式 */
      .textarea {
        height: 8vh;
      }

      .number {
        float: right;
        margin-top: 15rpx;
        color: #606266;
      }

    }
  }
}

</style>
