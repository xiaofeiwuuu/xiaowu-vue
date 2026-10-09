<template>
  <div class="app-container">
    <div class="page-content">
      <router-view v-slot="{ Component, route }">
        <!-- max 限制缓存页面数量，避免访问过的页面一直占用内存 -->
        <keep-alive :max="10">
          <component :is="Component" v-if="route.meta.keepAlive" :key="route.path" />
        </keep-alive>
        <component :is="Component" v-if="!route.meta.keepAlive" :key="route.path" />
      </router-view>
    </div>
    <Tabbar :model-value="showTabbar" />
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
  height: 100dvh; // iOS Safari 地址栏会遮住 100vh 的底部，dvh 为实际可视高度；不支持的浏览器回退到上一行
  padding-left: var(--safe-left);
  padding-right: var(--safe-right);
  
  .page-content {
    flex: 1;
    overflow-y: auto;
  }
}
</style> 