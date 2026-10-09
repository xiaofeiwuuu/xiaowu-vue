<template>
  <div class="app-container">
    <div class="page-content">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
    <Tabbar v-model="showTabbar" />
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