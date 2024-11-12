<template>

  <v-user :notice="false" v-if="!!$user.token">

    <!-- 顶部header区域 -->
    <view class="header">

      <view class="user">

        <!-- 用户同意授权，改为获取到的数据 -->
        <button class="avatar-wrapper" data-eventsync="true" open-type="chooseAvatar" @chooseavatar="setAvatar">
          <image class="image" :src="avatar"></image>
        </button>


        <view class="right">
          <view class="top">
            <open-data v-if="!$user.nickname" type="userNickName"></open-data>
            <!-- 用户同意授权，改为获取到的数据 -->
            <text v-else @click="nameDialog.open">{{ $user.nickname }}</text>
            <text class="level">{{ $user.id }}</text>
          </view>
          <view class="bottom">
            {{ welcome() }}
          </view>
        </view>
      </view>
    </view>


    <!-- 菜单 -->
    <view class="menu">
      <view class="item">
        <view class="flex">

          <text class="size iconfont icon-shuju"></text>
          <text class="left">注册日期</text>
        </view>
        <text class="right">{{ $user.register }}</text>
      </view>
      <view class="item">
        <view class="flex">
          <text class="size iconfont icon-liushui"></text>
          <text class="left">上次登录</text>
        </view>
        <text class="right">{{ $user.login_time }}</text>
      </view>
      <view class="item">
        <button class="feed" open-type="feedback">
          <view class="flex">
            <text class="size iconfont icon-bianji"></text>
            <text class="left">问题反馈</text>
          </view>
          <uni-icons class="right" type="right" size="18"></uni-icons>
        </button>
      </view>

      <template v-for="(i,index) of $sys.env.menu" :key="index">
        <view class="item" @click="$go('push',i.path)">
          <view class="flex">
            <text :class="`size iconfont ${i.icon}`"></text>
            <text class="left">{{ i.title }}</text>
          </view>
          <uni-icons class="right arrow" type="right" size="18"></uni-icons>
        </view>
      </template>


      <view class="item" v-if="$sys.env.donate" @click="inputDialog.open">
        <view class="flex">
          <text class="size iconfont icon-VIP"></text>
          <text class="left">赞助我们</text>
        </view>
        <uni-icons class="right" type="right" size="18"></uni-icons>
      </view>


      <view class="item">
        <button class="feed" @click="loginout">
          <view class="flex">
            <text class="size iconfont icon-shanchu"></text>
            <text class="left">账号注销</text>
          </view>
          <uni-icons class="right" type="right" size="18"></uni-icons>
        </button>
      </view>
    </view>


    <!-- 捐赠的弹出框 -->
    <uni-popup ref="inputDialog" type="dialog" :animation="false">
      <uni-popup-dialog ref="inputClose" mode="input" title="礼轻情意重!" placeholder="随便输一个金额 =.= ~"
                        @confirm="donateMoney"></uni-popup-dialog>
    </uni-popup>


    <!--  个人信息提交框  -->
    <uni-popup ref="nameDialog" type="dialog" :animation="false">
      <uni-popup-dialog ref="nameClose" mode="input" title="起名字" placeholder="输入您的大名" @confirm="setNickName">
      </uni-popup-dialog>
    </uni-popup>

  </v-user>
</template>


<script setup>

/* 显示昵称输入框 */
import load from "@/common/util/load";
import {welcome} from "@/common/util/common";
import initUser from '@/store/user'
import {computed, ref} from "vue";
import api from "@/service/api";
import donate from "@/common/sys/donate";

/* 用户信息 */
const user = initUser();

/* 用户头像 */
const avatar = computed(() => {
  return user.avatar.indexOf('http') > -1 ? user.avatar : `${api.host}${user.avatar}`
})

/* 弹框 */
const inputDialog = ref(null);
const nameDialog = ref(null);


/* 设置昵称，提交昵称 */
const setNickName = (nickname) => {

  /* 判断是否为空 */
  if (!nickname) {
    load.error("昵称不能为空")
    return
  }

  /* 判断昵称 */
  if (!nickname.length > 6) {
    load.error("昵称最多6个字哦")
    return
  }


  load.loading("更新中..."); //更新

  try {
    /* 请求登录接口 */
    uni.request({
      url: api.nickname,
      method: "POST",
      data: {
        nickname: nickname
      }
    }).then((res) => {

      const data = res.data.data;

      /* 如果登录成功！ */
      if (res.data.code) {
        user.nickname = nickname;
        load.success("更新成功");
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

};

/* 更新用户数据 */
const setAvatar = (avatar) => {

  let tempAvatar = avatar.detail.avatarUrl;

  load.loading("更新中..."); //更新

  try {

    /* 请求登录接口 */
    uni.uploadFile({
      /* 文件上传接口 */
      url: api.avatar, //仅为示例，非真实的接口地址
      filePath: tempAvatar,
      name: 'avatar'
    }).then((res) => {

      const avatar = res.data.data;

      /* 如果登录成功！ */
      if (res.data.code) {
        user.avatar = avatar;
        load.success("更新成功");
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
};


/**
 * 发起捐赠
 * @param money
 */
const donateMoney = (money) => {

  /* 判断金额 */
  if (!/^\d+\.?\d*$/.test(money)) {
    load.error("这个金额格式不对哦")
    return;
  }

  let fee = parseFloat(money);

  if (fee <= 0) {
    load.error("这个金额格式不对哦")
    return;
  }

  /* 调用赞助的方法 */
  donate(fee, "赞助成功，感谢您的支持！");

};

/* 账号注销 */
const loginout = () => {


  load.confirm("该操作将删除本应用内与您有关的所有数据（收纳箱、上传记录等），您确定继续吗？", () => {

    load.loading("注销中...");

    try {
      /* 请求登录接口 */
      uni.request({
        url: api.logout,
        method: "GET",
      }).then((res) => {

        /* 如果登录成功！ */
        if (res.data.code) {
          load.info("您的账号已注销，直接退出小程序就行啦！祝您万事如意！")
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


</script>

<style lang="scss">
/* 整个容器的样式 */
@import "index.scss";
</style>
