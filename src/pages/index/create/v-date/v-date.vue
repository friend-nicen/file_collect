<template>
  <view class="card">
    <!-- 时间选择  -->
    <view class="line">

      <view class="label">截止时间
        <text class="red">*</text>
      </view>


      <uni-datetime-picker style="width: 100%;" type="datetime"
                           :end="picker.end"
                           v-model="box.end_time">


        <view class="pick-datetime">
          <text class="text">{{ box.end_time }}</text>
          <text class="iconfont icon-shizhong"></text>
        </view>
      </uni-datetime-picker>
    </view>
  </view>

</template>

<script setup>
import {inject, reactive} from "vue";
import dayjs from "dayjs";

/* 注入数据 */
const box = inject("box");

/* 时间选择 */
const picker = reactive({
  end: dayjs().add(3, 'month').format("YYYY-MM-DD HH:mm:ss")
})


</script>

<style lang="scss" scoped>
.card {
  padding-bottom: 20rpx;

  /* 时间选择器的样式 */
  .pick-datetime {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 6rpx;
  }

  /* 改变时间选择器的颜色 */
  .pick-datetime .text {
    color: #606266;
    font-weight: lighter;
  }

  .iconfont {
    color: #606266;
    font-size: 36rpx;
  }
}
</style>
