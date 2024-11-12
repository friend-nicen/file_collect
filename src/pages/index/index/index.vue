<template>
  <v-user v-if="!!$user.token">
    <v-avatar/>
    <v-menu/>
    <v-contact/>
    <v-store/>
  </v-user>
</template>
<script setup>
import VAvatar from "./v-avatar/v-avatar.vue";
import VMenu from "./v-menu/v-menu.vue";
import VContact from "./v-contact/v-contact.vue";
import VStore from "#/v-store/v-store.vue";

import system from "@/store/system";
import {watch} from "vue";


/* 识别标题 */
watch(() => system().env.title, () => {
  uni.setNavigationBarTitle({
    title: system().env.title
  });
}, {
  immediate: true
})


</script>


<style scoped lang="scss">
/* 公共样式 */
@import '@/assets/css/common.scss';

:deep(.card) {
  @include flex-center;
  height: 16vh;
  @include card-icon();
  @include card-info(1);
}
</style>