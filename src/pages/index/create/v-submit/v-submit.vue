<template>
  <view class="main-button">
    <button type="primary" style="background-color: #007aff;" @click="submit">{{ edit ? "确认修改" : "发起收集" }}
    </button>
  </view>
</template>

<script setup>
import {inject} from "vue";
import load from "@/common/util/load";
import api from "@/service/api";
import {cloneDeep} from "@/common/util/common";

/* 注入数据 */
const edit = inject("edit");
const box = inject("box");
const listSet = inject("listSet");

/* 提交数据 */
const submit = () => {

  /* 待提交的数据对象 */
  const data = cloneDeep(box.value);


  /* 标题检测 */
  if (data.title === "") {
    load.error("收集标题不能为空哦")
    return;
  }

  /* 内容检测 */
  if (data.Instructions === "") {
    load.error("收集说明不能为空哦");
    return;
  }


  /* 如果是名单模式 */
  if (!data.mode) {

    /* 名单检测 */
    if (listSet.value[data.list].name === "") {
      load.error("名单名称不能为空哦");
      return;
    }

    /* 名单内容检测 */
    if (listSet.value[data.list].list === "") {
      load.error("名单不能为空哦");
      return;
    }

    /* 选择的名单 */
    data.listSet = cloneDeep(listSet.value[data.list]);
    data.listSet.index = data.list; //名单索引


    /* 移除规则 */
    delete data.regular;

  } else {

    /* 字段检测 */
    if (data.regular[0].column === "") {
      load.error("第一个字段不能为空哦！");
      return;
    }

    /* 移除空规则 */
    data.regular = data.regular.filter(item => {
      return item.column !== "";
    })

  }


  load.loading("加载中...");

  try {
    /* 请求登录接口 */
    uni.request({
      url: api.create,
      method: "POST",
      data: data,
    }).then((res) => {
      /* 如果登录成功！ */
      if (res.data.code) {
        /* 修改时跳转详细*/
        uni.redirectTo({
          url: "/pages/task/collect/index?id=" + res.data.data
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
}

</script>

<style lang="scss" scoped>
.main-button {
  margin: 36rpx 0 25rpx;
  padding: 10rpx 28rpx 5rpx 28rpx;
  box-sizing: border-box;
  width: 100%;
}
</style>
