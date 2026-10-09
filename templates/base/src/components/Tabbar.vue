<template>
  <div class="tabbar" v-show="modelValue">
    <div 
      v-for="(item, index) in tabbarItems" 
      :key="index"
      class="tabbar-item"
      :class="{ active: currentPath === item.path }"
      @click="handleTabClick(item)"
    >
      <i :class="['iconfont', item.icon]"></i>
      <span>{{ item.text }}</span>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  },
  title: String,        // 标题文本
  showBack: Boolean,    // 是否显示返回按钮
  leftText: String,     // 左侧文本
  rightText: String,    // 右侧文本
  fixed: Boolean        // 是否固定在顶部
})

const emit = defineEmits(['update:modelValue'])

const route = useRoute()
const router = useRouter()

const currentPath = computed(() => route.path)

const tabbarItems = [
  { text: '首页', path: '/home', icon: 'icon-home' },
  { text: '我的', path: '/mine', icon: 'icon-user' }
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
  background: #fff;
  border-top: 1px solid #eee;

  .tabbar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 12px;

    &.active {
      color: #1989fa;
    }

    .iconfont {
      font-size: 20px;
      margin-bottom: 4px;
    }
  }
}
</style> 