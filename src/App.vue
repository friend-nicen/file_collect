<script>
export default {
  onLaunch: function () {

    /* 页面允许分享 */
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })


    /* 自动检测小程序是否有新版本 */
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager(); //获取更新管理器
      /* 如果有更新则直接更新 */
      updateManager.onUpdateReady(function () {
        updateManager.applyUpdate()
      })
    }
  }
}
</script>

<style lang="scss">

/* 每个页面公共css */
@import './uni_modules/uni-scss';
@import "@/assets/css/iconfont.css";

/* 设置整个项目的背景色 */
page {
  background-color: #f4f4f4 !important;
}

image {
  height: auto;
}

text {
  cursor: default;
}

view {
  box-sizing: border-box;
}


/* 调整所有占位符的样式 */
.placeholder {
  font-size: 15px;
  font-weight: lighter;
}

/* 点击效果 */
.hover {
  background-color: #cacaca !important;
}


</style>
