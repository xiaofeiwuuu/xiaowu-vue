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

<script setup lang="ts">
import { useRoute } from 'vue-router'
import Tabbar from '@/components/Tabbar.vue'
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