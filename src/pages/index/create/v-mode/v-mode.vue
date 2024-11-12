<template>
  <view class="card">

    <!--文件收纳箱基本信息  -->
    <view class="line mode">
      <view class="label"> 收集方式：</view>
      <!-- 单选框组合 -->
      <radio-group class="radio-group" @change="box.mode = box.mode === 1 ? 0 : 1">
        <label class="wrap">
          <radio color="#2979FF" class="radio" :checked="!box.mode"/>
          按指定名单
        </label>
        <label class="wrap">
          <radio color="#2979FF" class="radio" :checked="box.mode"/>
          按人员信息
        </label>
      </radio-group>
    </view>

    <view class="small">
      <text class="blue">[当前]</text>
      <text class="rule">{{ currentRule }}</text>
    </view>

    <!--开始渲染各种字段  -->
    <template v-if="box.mode">
      <v-regular/>
    </template>
    <template v-else>
      <v-list/>
    </template>


  </view>

</template>

<script setup="">
import VRegular from "./v-regular/v-regular.vue";
import VList from "./v-list/v-list.vue";
import {computed, inject, provide, ref} from "vue";

/* 注入盒子数据 */
const box = inject("box");
/* 当前规则 */
const currentRule = computed(() => {

  /* 如果打开了重命名开关 */
  let regular = "";

  /* 读取输入的命名字段 */
  if (box.value.mode) {

    //遍历所有命名规则
    box.value.regular.forEach(function (item) {
      //判断是不是开头
      if (regular === "") {
        regular = item.column;
      } else {

        //如果输入为空，跳过
        if (item.column !== "") {
          regular = regular + "-" + item.column;
        }
      }
    });

    //返回最终规则
    return "输入" + regular + "可上传文件";

  } else {
    return "输入指定名单内的人员信息可上传文件";
  }

});
/* 名单是否加载 */
provide('loaded', ref(false));

</script>

<style lang="scss" scoped>
$union-color: #606266;

.card {

  padding-bottom: 12px;

  /* 选择方式 */
  .mode {
    padding-bottom: 0;

    .label {
      margin-right: 0;
    }

    .radio-group {

      display: flex;
      align-items: center;
      width: 100%;

      .wrap {

        display: flex;
        align-items: center;
        font-size: 30rpx;
        margin-left: 10px;

        .radio {
          transform: scale(0.7);
        }
      }
    }
  }


}
</style>
