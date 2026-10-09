<template>
  <div class="app-container">
    <div class="page-content">
      <!-- max 限制缓存页面数量，避免访问过的页面一直占用内存 -->
      <keep-alive :max="10">
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
    <Tabbar v-model="showTabbar" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()

const showTabbar = computed(() => {
  return !route.meta.hideTabbar
})
</script>

<style lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  
  .page-content {
    flex: 1;
    overflow-y: auto;
  }
}
</style> 