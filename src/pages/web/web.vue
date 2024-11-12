<template>
  <web-view v-if="!!$user.token" :src="url"/>
</template>
<script setup>

import load from "@/common/util/load";

/* url编解码获取参数 */
const props = defineProps({
  "url": {
    required: true
  },
  'hide': {
    required: true,
    default: 0
  }
});

/* 访问的URL */
const url = decodeURIComponent(props.url);

/* 加载效果 */
if (!props.hide) {
  load.loading("加载中...");
  load.loaded(500);
}

</script>