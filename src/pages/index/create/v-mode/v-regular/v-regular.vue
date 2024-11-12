<template>
  <view class="line regular" v-for="(regular,index) of box.regular" :key="regular.id">
    <input class="input"
           placeholder-class="placeholder"
           :maxlength="$sys.env.number.itemName"
           type="text"
           placeholder="如姓名、手机号"
           v-model="regular.column"/>
    <text class="number">{{ regular.column.length }}/{{ $sys.env.number.itemName }}</text>
    <text class="delete" v-if="index !== 0" @click="deleteRegular(index)">—</text>
    <text class="delete" v-else></text>
  </view>


  <!-- 默认的第一个字段 -->
  <view class="line regular">
    <view class="insert" @click="insertRegular">
      <uni-icons type="plus" size="20" color="#2979FF"></uni-icons>
      <text class="text">添加字段</text>
    </view>
  </view>
</template>

<script>
export default {
  options: {
    virtualHost: true
  }
}
</script>

<script setup>
import {inject} from "vue";

/* 注入盒子数据 */
const box = inject("box");

/* 删除一项规则 */
const deleteRegular = (index) => {
  box.value.regular.splice(index, 1);
}

/* 新增一项规则 */
const insertRegular = () => {
  box.value.regular.push({
    id: box.value.regular[box.value.regular.length - 1].id + 1,
    /* 标记名 */
    column: "",
  });
}
</script>

<style lang="scss" scoped>
$union-color: #606266;

/* 规则设置 */
.regular {

  .number {
    color: $union-color;
  }

  /* 删除条的样式 */
  .delete {
    color: $union-color;
    margin-left: 10rpx;
    font-size: 36rpx;
    text-align: center;
    font-weight: bolder;
    min-width: 10%;
  }

  /* 新增规则 */
  .insert {
    display: flex;
    align-items: center;
    color: #2979FF;

    .text {
      color: #2979FF;
    }

    :deep(.uni-icons) {
      margin-bottom: -4rpx;
    }
  }
}

</style>
