<template>
  <view class="menu">
    <template v-for="(i,k) of links" :key="k">
      <view class="card" hover-class="hover" @click="$go('push',i.path)">
        <!--  用户头像  -->
        <view class="icon">
          <!-- 用户同意授权，改为获取到的数据 -->
          <image class="image" :src="i.icon"></image>
        </view>

        <!-- 用户信息 -->
        <view class="information">

          <view class="title">
            {{ i.title }}
          </view>

          <view class="description">{{ i.description }}</view>

        </view>

      </view>
    </template>
  </view>

</template>

<script setup>
import api from "@/service/api";
import initSys from '@/store/system'


/* 系统信息 */
const sys = initSys();

const getIcon = (icon) => {
  return icon.indexOf('http') > -1 ? icon : `${api.host}${icon}`
}

/* 菜单 */
const links = [
  {
    title: "图片收纳箱",
    description: "收截图、证件照、各种图片",
    icon: getIcon(sys.env.icon.image),
    path: `/pages/index/create/index?type=1`,
  },
  {
    title: "文件收纳箱",
    description: "收任意类型的文件",
    icon: getIcon(sys.env.icon.file),
    path: `/pages/index/create/index?type=2`
  },
  {
    title: "新手上路",
    description: "不知道用就点我",
    icon: getIcon(sys.env.icon.help),
    path: `/pages/index/help/index`
  }
];


</script>

<style lang="scss" scoped>

@import '@/assets/css/common.scss';


.menu {

  display: flex;
  flex-direction: column;

  /* 底部选择样式 */
  .card {
    @include card($margin: 12rpx 5%);
  }
}


</style>
