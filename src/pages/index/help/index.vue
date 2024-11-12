<template>
  <web-view v-if="!!$user.token" :src="$sys.env.webview.help"/>
</template>
<script setup>
import load from "@/common/util/load";

load.loading("加载中...");
load.loaded(500);
</script>