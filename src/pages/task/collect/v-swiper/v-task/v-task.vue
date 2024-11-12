<template>
  <!-- 如果是所有者，显示的内容 -->
  <view class="action" @click="$go('push',`/pages/index/create/index?id=${box.id}`)">
    <image class="image" mode="widthFix" src="@/static/collect/edit.png"></image>
    <view class="this">编辑收纳箱</view>
  </view>


  <view class="action" @click="changeStatus">
    <image class="image" mode="widthFix" :src="box.status === 1?stop:resume">
    </image>
    <view class="this">{{ box.status === 1 ? "停止收纳" : "继续收纳" }}</view>
  </view>


  <view class="action" v-if="box.permiss === 1" @click="deleteTask">
    <image class="image" mode="widthFix" src="@/static/collect/delete.png"></image>
    <view class="this">删除收纳箱</view>
  </view>


  <view class="action" v-if="box.permiss === 1" @click="$go('push',`/pages/share/share?id=${box.id}`)">
    <image class="image" mode="widthFix" v-if="swiperIndex === 2"
           src="@/static/collect/common.png"></image>
    <view class="this">共享收纳箱</view>
  </view>

  <view class="action" @click="cancelShare">
    <image class="image" mode="widthFix" src="@/static/collect/disconnect.png"></image>
    <view class="this">取消共享</view>
  </view>


  <view class="action" v-if="box.permiss === 1" @click="$go('push',`/pages/share/list?id=${box.id}`)">
    <image class="image" mode="widthFix" src="@/static/collect/list.png"></image>
    <view class="this">查看已共享</view>
  </view>
</template>

<script>
export default {options: {virtualHost: true}}
</script>

<script setup>
import {inject} from "vue";
import stop from '@/static/collect/stop.png';
import resume from '@/static/collect/resume.png';
import api from "@/service/api";
import load from "@/common/util/load";
import dayjs from "dayjs";
import {delay} from "@/common/util/common";

/* 注入盒子信息 */
const box = inject('box');
const swiperIndex = inject('swiperIndex');

/* 改变收集状态 */
const changeStatus = () => {

  /* 判断过期时间 */
  if (!dayjs().isBefore(dayjs(box.value.end_time))) {
    load.error("当前收纳箱已到期，请先修改收纳结束时间为未来时间后，再继续该操作！点击下面编辑收纳箱")
    return;
  }

  load.loading();//加载中

  try {
    /* 请求登录接口 */
    uni.request({
      url: `${api.changeStatus}?box=${box.value.id}`,
      method: "GET"
    }).then((res) => {

      /* 如果登录成功！ */
      if (res.data.code) {
        load.info(res.data.errMsg); //弹出信息
        box.value.status = res.data.data; //更新状态
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


/* 删除任务 */
const deleteTask = () => {

  load.confirm('任务删除后所有文件和记录将同步删除，确定删除该任务吗？',
      () => {

        try {
          /* 请求登录接口 */
          uni.request({
            url: `${api.delete}?box=${box.value.id}`,
            method: "GET"
          }).then((res) => {

            /* 如果登录成功！ */
            if (res.data.code) {

              load.success(res.data.errMsg);
              load.delay("/pages/index/list/index", 300, false);

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


/* 取消共享 */
const cancelShare = () => {

  /* 是共享权限 */
  if (box.value.permiss === 2) {

    /* 确认取消权限！ */
    load.confirm("取消共享后您将失去任务的管理权限，确定取消共享？", () => {

      try {
        /* 加载效果 */
        load.loading();

        /* 请求登录接口 */
        uni.request({
          url: `${api.cancel}?box=${box.value.id}`,
          method: "GET",
        }).then((res) => {


          /* 如果登录成功！ */
          if (res.data.code) {

            /* 提示 */
            load.info(res.data.errMsg, () => {
              /* 跳转面板 */
              uni.switchTab({
                url: "/pages/index/list/index",
              })
            });

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


  } else {
    uni.navigateTo({
      url: `/pages/share/list?id=${box.value.id}`
    })
  }

}

</script>

<style lang="scss" scoped>
@import "../common.scss";
</style>
