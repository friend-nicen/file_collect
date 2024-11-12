<template>
  <!-- 如果开启了批量重命名 -->
  <!-- 规则模式只显示第一个,名单模式显示组输入数据 -->
  <!-- 开启批量,就最上面有一个输入,下面只显示文件 -->
  <!-- 不开启批量,遍历输出所有文件 -->
  <view v-if="batch && files.length > 0" class="task">

    <view class="popup-text">
      <text>总文件数：{{ files.length }} / 已上传：{{ finish }}</text>
    </view>

    <view class="popup-progress">
      <progress :percent="(finish/files.length)*100" stroke-width="1"/>
    </view>

    <!-- 如果是规则模式 -->
    <template v-if="box.mode">
      <!-- 循环输出需要输入的字段 -->
      <view class="line" v-for="(item,index) in files[0].info" :key="index">

        <view class="label">
          <text class="red">*</text>
          {{ box.regular[index].column }}
        </view>


        <view class="downline">
						<textarea class="textarea"
                      placeholder-class="placeholder"
                      :placeholder="`请输入${box.regular[index].column}`"
                      auto-height
                      :maxlength="$sys.env.number.inputInfo"
                      type="text"
                      v-model="files[0].info[index]"/>

          <text class="number">{{ files[0].info[index].length }}/{{ $sys.env.number.inputInfo }}</text>
        </view>

      </view>
    </template>

    <!-- 显示名单模式 -->
    <template v-else>
      <view class="line">
        <view class="label">
          <text class="red">*</text>
          <text>请输入{{ box.list.name }}</text>
        </view>
        <view class="downline">
          <uni-combox class="combox" :candidates="list" :placeholder="`请输入${box.list.name}`"
                      v-model="files[0].info[0]"/>
        </view>
      </view>
    </template>


  </view>
</template>

<script setup>
/* 批量注入 */
import {injects} from "@/common/util/common";
import {computed} from "vue";


/* 注入响应式变量 */
const {box, batch, files, finish, list} = injects(['box', 'batch', 'files', 'finish', 'list']);

</script>
