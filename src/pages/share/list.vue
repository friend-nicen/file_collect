<template>

  <template v-for="(user,i) in shares" :key="i">

    <view class="task">
      <view class="task-source">
        <view class="item">
          <image class="image" :src="getAvatar(user.avatar)" mode="widthFix"/>
          <text class="nickname">{{ user.nickname }}</text>
        </view>
        <text class="operate" @click="cancel(user)">取消共享</text>
      </view>

    </view>

  </template>

  <view class="end" v-if="loaded">已经到底了</view>


</template>

<script setup>
import {onLogin} from "@/common/util/event";
import {ref} from "vue";
import load from "@/common/util/load";
import api from "@/service/api";

const props = defineProps(['id']);
const loaded = ref(false); //加载状态
const shares = ref([]); //已共享

/* 处理头像 */
const getAvatar = (avatar) => {
  return avatar.indexOf('http') > -1 ? avatar : `${api.host}${avatar}`
}

/* 取消共享 */
const cancel = (user) => {
  load.confirm(`您正在取消${user.nickname}的任务共享权限，是否继续？`, () => {
    try {
      load.loading();
      /* 请求登录接口 */
      uni.request({
        url: `${api.revoke}?box=${props.id}&user=${user.user}`,
        method: "GET",
      }).then((res) => {

        /* 如果登录成功！ */
        if (res.data.code) {
          loadData(); //刷新
          load.info(res.data.errMsg);
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


/* 加载数据 */
const loadData = () => {
  try {
    load.loading();
    /* 请求登录接口 */
    uni.request({
      url: `${api.shares}?box=${props.id}`,
      method: "GET",
    }).then((res) => {

      /* 如果登录成功！ */
      if (res.data.code) {
        shares.value = res.data.data;
        loaded.value = true;
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

/* 已登录时触发 */
onLogin(loadData);
</script>


<style scoped lang="scss">
/* 公共样式 */
@import '@/assets/css/common.scss';

.task {

  @include card($margin: 18rpx 2.5% 10rpx 2.5%, $padding: 20rpx 30rpx, $width: 95%);

  display: flex;
  flex-wrap: wrap;
  font-size: 27rpx;
  font-weight: 350;
  color: #000000;

  /* 昵称 */
  .nickname {
    margin-left: 20rpx;
  }

  .plain {
    color: #909399;
  }

  /* 任务的发起人信息 */
  .task-source {

    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 32rpx;


    .image {
      width: 10%;
      border-radius: 50%;
      min-height: 60rpx;
      border: 1px solid #bfc3cb;
    }

    .item {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    .operate {
      color: #2979FF;
      white-space: nowrap;
    }
  }
}

/* 底部无数据的提示样式 */
.end {
  width: 100%;
  color: #8a8d93;
  text-align: center;
  margin-top: 38rpx;
  margin-bottom: 38rpx;
}

</style>
