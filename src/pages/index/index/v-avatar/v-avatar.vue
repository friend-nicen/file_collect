<template>
  <view class="card" hover-class="hover" @click="$go('tab','/pages/index/user/index')">
    <!--  用户头像  -->
    <view class="icon">
      <!-- 用户同意授权，改为获取到的数据 -->
      <image class="image" :src="avatar"></image>
    </view>

    <!-- 用户信息 -->
    <view class="information">

      <view class="title">
        <!-- 用户未同意授权之前显示微信开发能力提供的数据 -->
        <open-data v-if="!$user.nickname" type="userNickName"></open-data>
        <!-- 用户同意授权，改为获取到的数据 -->
        <text v-else>{{ $user.nickname }}</text>
        <text class="level">VIP</text>
      </view>

      <view class="description">当前拥有收纳箱：{{ $user.count }}个</view>

    </view>

  </view>
</template>

<script setup>
import api from "@/service/api";
import initUser from '@/store/user'
import {computed} from "vue";
import {onShow} from "@dcloudio/uni-app";
import load from "@/common/util/load";

/* 用户信息 */
const user = initUser();

/* 用户头像 */
const avatar = computed(() => {
  return user.avatar.indexOf('http') > -1 ? user.avatar : `${api.host}${user.avatar}`
})


/* 页面被触发时，更新用户任务数量 */
onShow(() => {
  try {
    /* 请求登录接口 */
    uni.request({
      url: api.count,
      method: "GET"
    }).then((res) => {
      /* 如果登录成功！ */
      if (res.data.code) {
        user.setCount(res.data.data);
      } else {
        load.error(res.data.errMsg); //弹出错误信息
      }
    }).catch(e => {
      console.log(e);
      load.error(e)
    })
  } catch (e) {
    console.log(e)
    load.error(e);
  }
});

</script>

<style lang="scss" scoped>

@import '@/assets/css/common.scss';

/* 底部选择样式 */
.card {
  @include card($margin: 15rpx 2.5% 40rpx, $width: 95%);
}

</style>
