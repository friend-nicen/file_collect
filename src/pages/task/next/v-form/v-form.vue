<template>
  <template v-if="files.length > 0">
    <!-- 正常的输出所有文件列表 -->
    <view class="task" v-for="(file,i) in files" :key="file.id">

      <!-- 批量命名时是否全部变化 -->
      <!-- 没有开启批量命令,则显示输入框 -->
      <template v-if="batch">

        <view class="line filename">
          <view class="label">
            <!-- 空串的数组 - 的数量等于数组元素数量 -->
            <text class="iconfont icon-wenjian"></text>
            <text class="wrap"> {{ getNameBatch(file, i) }}</text>
          </view>
          <text class="iconfont icon-shanchu" @click="delFile(i)"></text>
        </view>

      </template>


      <template v-else>
        <view class="line filename">
          <view class="label">
            <text class="iconfont icon-wenjian"></text>
            <text>{{ getName(file, i) }}</text>
          </view>
          <text class="iconfont icon-shanchu" @click="delFile(i)"></text>
        </view>
      </template>


      <view class="popup-text">
        <text>已上传：{{ (file.size / 1024).toFixed(2) + 'KB' }}</text>
        <text class="preview" @click="preview(i)">预览
        </text>
      </view>
      <view class="popup-progress">
        <progress :percent="file.progress" stroke-width="1"/>
      </view>

      <!-- 遍历输出所有规则 -->
      <view v-if="!batch" class="line" v-for="(item,k) in file.info" :key="k">
        <!-- 获取任务规则的名字等信息 -->
        <view class="label">
          <text class="red">*</text>
          <text>{{ box.regular[k].column }}</text>
        </view>
        <view class="downline">
					<textarea
              class="textarea"
              placeholder-class="placeholder"
              auto-height
              :placeholder="`请输入${box.regular[k].column}`"
              :maxlength="$sys.env.number.inputInfo"
              type="text"
              v-model="file.info[k]"/>
          <text class="number">{{ file.info[k].length }}/{{ $sys.env.number.inputInfo }}</text>
        </view>
      </view>

    </view>
  </template>
</template>

<script setup>
/* 依赖注入 */
import {injects} from "@/common/util/common";
import load from "@/common/util/load";
import open from "@/common/sys/open";
/* 注入响应式变量 */
const {box, batch, files, finish, list} = injects(['box', 'batch', 'files', 'finish', 'list']);

/* 排列文件名 */
const getName = (item, index) => {
  /* 如果表单全部是空 */
  if ((item.info.join("-").length === item.info.length - 1)) {
    return item.tempFile;
  } else {
    return item.info.join("-") + (index === 0 ? "" : "-" + index)
  }
}


/* 获取文件名 */
const getNameBatch = (item, index) => {
  /* 第一个文件 */
  const file = files.value[0];
  /* 如果表单全部是空 */
  if ((file.info.join("-").length === file.info.length - 1)) {
    return item.tempFile;
  } else {
    return file.info.join("-") + (index === 0 ? "" : "-" + index)
  }
}

/* 删除文件 */
const delFile = (i) => {
  load.confirm("确定取消上传该文件吗？", () => {
    files.value.splice(i, 1);
    /* 文件删完了 */
    if (files.value.length === 0) {
      uni.navigateTo({
        url: `/pages/collect/upload?id=${box.value.id}`
      })
    }
  })
}

/* 预览文件 */
const preview = (index) => {
  open(files.value[index].tempFile);
}

</script>

<style lang="scss" scoped>
.task {
  .line {

    .label {
      width: 80%;
      word-wrap: break-word;
      word-spacing: normal;
      word-break: break-all;
    }

    .icon-wenjian {
      margin-right: 15rpx;
    }
  }

  .preview {
    color: #2979FF;
  }
}
</style>
