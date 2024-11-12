<template>
  <view class="action" @click="bundle">
    <image class="image" mode="widthFix" src="@/static/collect/accessary.png"></image>
    <view class="this">获取下载链接</view>
  </view>
  <view class="action" @click="openDialog(1)">
    <image class="image" mode="widthFix" src="@/static/collect/wechat.png"></image>
    <view class="this">下载到微信</view>
  </view>
  <view class="action" @click="openDialog(2)">
    <image class="image" mode="widthFix" src="@/static/collect/uploaded.png"></image>
    <view class="this">导出信息表格</view>
  </view>
</template>

<script>
export default {options: {virtualHost: true}}
</script>

<script setup>
import {injects} from "@/common/util/common";
import load from "@/common/util/load";

/* 注入盒子信息 */
const {box, openDialog} = injects(['box', 'openDialog']);

/* 打包文件 */
const bundle = () => {
  load.confirm("为了您的信息安全，请勿将链接转发给他人，链接30分钟内有效，复制链接后通过浏览器打开链接进行下载", () => {
    openDialog(1, false);
  })
}

</script>

<style lang="scss" src="../common.scss" scoped/>
