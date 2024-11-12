<template>
  <view class="action" @click="$go('push',`/pages/task/share/index?id=${box.id}`)">
    <image class="image" mode="widthFix" src="@/static/collect/wechat.png"></image>
    <view class="this">微信好友/群</view>
  </view>
  <view class="action" @click="$go('push',`/pages/task/qrcode/index?id=${box.id}`)">
    <image class="image" mode="widthFix" src="@/static/collect/qrcode.svg"></image>
    <view class="this">小程序码分享</view>
  </view>
  <view class="action" @click="$go('push',`/pages/collect/upload?id=${box.id}`)">
    <image class="image" mode="widthFix" src="@/static/collect/upload.png"></image>
    <view class="this">自己提交文件</view>
  </view>

  <view class="action" @click="copyLink">
    <image class="image" mode="widthFix" src="@/static/collect/link.svg"></image>
    <view class="this">网络链接分享</view>
  </view>
  <view class="action" @click="closeAd()">
    <image class="image" mode="widthFix" src="@/static/collect/close.svg"></image>
    <view class="this">免费关闭广告</view>
  </view>
  <view class="action" v-if="$sys.env.donate" @click="inputDialog.open">
    <image class="image" mode="widthFix" src="@/static/collect/donate.svg"></image>
    <view class="this">赞助我们</view>
  </view>


</template>

<script>
export default {options: {virtualHost: true}}
</script>


<script setup>
import {inject} from "vue";
import load from "@/common/util/load";
import api from "@/service/api";
import watchVideo from "@/common/ad/watch";
import initSys from "@/store/system";

/* 系统信息 */
const system = initSys();
const inputDialog = inject('inputDialog');

/* 注入盒子信息 */
const box = inject('box');

/* 复制分享链接 */
const copyLink = () => {
  /* 弹出询问框 */
  load.confirm(
      "网络链接可以分享到任意平台，在浏览器中打开后将自动唤起微信小程序并跳转到文件上传界面（注意：电脑端无法唤起小程序，只在手机端有效）。如有需要，请点击确定，系统将自动复制分享链接。",
      () => {

        load.loading(); //加载效果

        try {
          /* 请求登录接口 */
          uni.request({
            url: `${api.copyLink}?box=${box.value.id}`,
            method: "GET"
          }).then((res) => {

            /* 如果登录成功！ */
            if (res.data.code) {

              /* 复制到剪切板 */
              uni.setClipboardData({
                data: res.data.data,
                showToast: false,
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


/* 关闭广告 */
const closeAd = () => {
  /* 弹出提示 */
  load.confirm(
      "小程序上线至今，所有服务一直都是不收费的，绝大部分的运维费用都是来自微信流量主的广告（上传、列表、提交页面一共三个广告）。经过一段时间的调研，我们发现某些情况下确实不应该出现广告（如某些正式的活动、正能量的宣传等等）；如果您认为您的收集任务不应该出现广告，请点击下方确定后，观看并点击激励视频广告，观看点击完毕后我们将为您取消这个任务内的所有广告。",
      async () => {

        /* 判断观看结果 */
        if (!await watchVideo()) {
          return;
        }

        load.loading(); //加载效果

        try {
          /* 请求登录接口 */
          uni.request({
            url: `${api.closeAd}?box=${box.value.id}`,
            method: "GET"
          }).then((res) => {

            /* 如果登录成功！ */
            if (res.data.code) {
              load.info(res.data.errMsg); //弹出错误信息
              system.ad.box = false; //关闭当前任务的广告
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


      });
}

</script>

<style lang="scss" scoped>
@import "../common.scss";
</style>
