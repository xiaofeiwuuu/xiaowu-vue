<template>
  <div class="tabbar" v-show="modelValue">
    <div 
      v-for="(item, index) in tabbarItems" 
      :key="index"
      class="tabbar-item"
      :class="{ active: currentPath === item.path }"
      @click="handleTabClick(item)"
    >
      <span>{{ item.text }}</span>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

defineProps({
  modelValue: {
    type: Boolean,
    default: true
  }
})

const route = useRoute()
const router = useRouter()

const currentPath = computed(() => route.path)

const tabbarItems = [
  { text: '首页', path: '/home' },
  { text: '我的', path: '/mine' }
]

const handleTabClick = (item) => {
  if (currentPath.value !== item.path) {
    router.push(item.path)
  }
}
</script>

<style lang="scss" scoped>
.tabbar {
  height: 50px;
  display: flex;
  background: var(--van-background-2);
  border-top: 1px solid var(--van-border-color);

  .tabbar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--app-text-secondary);
    font-size: 12px;

    &.active {
      color: var(--van-primary-color);
    }

  }
}
</style> 