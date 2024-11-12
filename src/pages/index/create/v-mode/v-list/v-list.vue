<template>


  <view class="line">

    <view class="label">名单名称
      <text class="red">*</text>
    </view>

    <input class="input"
           placeholder-class="placeholder"
           :maxlength="$sys.env.number.listName"
           type="text"
           placeholder="如学号、姓名"
           v-model="listSet[box.list].name"/>

    <text style="color: #606266;">{{ listNameLength }}/{{ $sys.env.number.listName }}</text>

  </view>

  <view class="line list">
    <view class="label">选择名单
      <text class="red">*</text>
    </view>

    <view class="area">
        <textarea placeholder-class="placeholder"
                  maxlength="-1"
                  class="textarea"
                  v-model="listSet[box.list].list"
                  placeholder="可批量复制到此处，按行分隔，一行一个，编辑过的名单将会自动保存!"/>
    </view>
  </view>

  <!-- 底部名单 -->
  <view class="listNumber">
    <text class="number">
      已输入{{ listNumber }}个
    </text>
  </view>


  <!-- 名单集合 -->
  <view class="list-set">
    <!-- 遍历输出名单名称 -->
    <view class="list-item" v-for="(list,index) in listSet" @click="box.list = index"
          :class="{active:box.list === index}"
          :key="index">
      {{ list.name }}
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
import {computed, inject} from "vue";
import api from "@/service/api";
import load from "@/common/util/load";

/* 注入盒子数据 */
const box = inject("box");
const listSet = inject('listSet');
const loaded = inject('loaded');


/* 名单字数 */
const listNameLength = computed(() => {
  return listSet.value[box.value.list].name.length;
});

/* 名单数量 */
const listNumber = computed(() => {
  return listSet.value[box.value.list].list.split("\n").length
})

/* 加载用户已有名单 */
if (!loaded.value) {
  try {

    load.loading("加载中...");

    /* 请求登录接口 */
    uni.request({
      url: api.list,
      method: "GET",
    }).then((res) => {


      /* 如果登录成功！ */
      if (res.data.code) {

        const list = res.data.data;

        /* 更新名单 */
        for (let i of list) {
          listSet.value[i.index] = {
            name: i.name,
            list: i.list
          }
        }

        /* 标记已加载 */
        loaded.value = true;


      } else {
        load.error(res.data.errMsg); //弹出错误信息
      }

    }).catch(e => {
      console.log(e);
      load.error(e)
    }).finally(() => {
      load.loaded(200);
    });

  } catch (e) {
    console.log(e)
    load.error(e);
  }

}
</script>

<style lang="scss" scoped>

@import '@/assets/css/common.scss';


.list {

  align-items: flex-start !important;
  margin-bottom: 10rpx;

  /* 名单输入框 */
  .area {
    width: 100%;
    padding-top: 5rpx;
    position: relative;

    .textarea {
      height: 12vh;
    }
  }
}

/* 名单人数 */
.listNumber {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-bottom: 10rpx;

  .number {
    color: $union-color;
    font-size: $font-size-3;
  }
}


/* 文本框下方的名单选项 */
.list-set {

  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin-top: 0;
  color: $union-color;


  .list-item {
    border: 1px solid #007AFF;
    color: #007AFF;
    padding: 1px 5px;
    font-size: 22rpx;
    margin: 2px 3px;
    border-radius: 5px;
    cursor: pointer;
  }


  /* 被选名单 */
  .active {
    background-color: #007AFF;
    color: white;
  }

}


</style>
