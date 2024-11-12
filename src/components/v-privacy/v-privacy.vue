<template>
  <view class="fixed">
    <view class="modal">
      <view class="title">
        温馨提示
      </view>
      <view class="body">
        按照最新政策，您需要同意我们的
        <text class="protocol" @click="open">《隐私政策》</text>
        后，才能继续使用微信小程序。如果您不同意，我们将无法继续提供服务。
      </view>
      <view class="footer">
        <navigator target="miniProgram" open-type="exit" class="button cancel">退出</navigator>
        <button id="agree-btn" @agreeprivacyauthorization="agree" open-type="agreePrivacyAuthorization"
                class="button confirm">
          同意并继续
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import load from "@/common/util/load";
import api from "@/service/api";
import system from "@/store/system";
import globalData from "@/store/data";

/* 打开隐私协议 */
const open = () => {
  wx.openPrivacyContract({
    fail: (e) => {
      load.error(e)
    }
  })
}

/* 同意用户协议 */
const agree = () => {
  try {
    /* 请求登录接口 */
    uni.request({
      url: api.privacy,
      method: "GET",
    }).then(() => {

      /* 标记已经同意协议 */
      system().privacy.show = false;

      /* 如果需要调用resolve */
      if (globalData.resolve) {
        globalData.resolve({buttonId: 'agree-btn', event: 'agree'});
        globalData.resolve = null;
      }

    }).catch(e => {
      console.log(e);
      load.error(e)
    })
  } catch (e) {
    console.log(e)
    load.error(e);
  }
}
</script>


<style scoped lang="scss">
/* 公共样式 */
@import '@/assets/css/common.scss';

.fixed {
  @include flex-center;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 15;
  background-color: rgba(#000, 0.3);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);

  .modal {
    width: 75%;
    transform: translateY(-20%);
    padding: 25px 25px 22px;
    background-color: white;
    border-radius: 10px;

    .title {
      color: $text-1;
      font-size: 37.5rpx;
      margin-bottom: 12px;
    }

    .body {
      color: $union-color;
      font-size: $font-size-1;
      line-height: 1.6;
      @include wrap;

      .protocol {
        text-decoration: underline;
        color: $primary-color;
      }
    }

    .footer {
      @include flex-align-center;
      justify-content: space-between;
      margin-top: 20px;

      .button {
        @include flex-center;
        width: 45%;
        padding: 16px 0;
        margin: 0;
        cursor: pointer;
        line-height: normal;
        border-radius: 30px;
        font-size: $font-size-3;

        &::after {
          border: none;
        }
      }


      .cancel {
        background-color: transparent;
        border: 1px solid $border-color;
        color: $text-1;
        user-select: none;

        /* 移除点击时的蓝色背景 */
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
        -webkit-user-select: none;
        -moz-user-select: none;

        &:focus {
          outline: none;
        }

        &:hover {
          background-color: $bg-color;
        }
      }

      .confirm {
        background-color: $primary-color;
        color: white;

        &:hover {
          background-color: rgba($primary-color, 0.8);
        }
      }
    }
  }
}
</style>
