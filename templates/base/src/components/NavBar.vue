<template>
  <van-nav-bar
    :title="title"
    :left-text="leftText"
    :right-text="rightText"
    :left-arrow="showBack"
    :placeholder="fixed"
    :safe-area-inset-top="fixed"
    :style="{ backgroundColor }"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  >
    <!-- 左侧插槽 -->
    <template #left v-if="$slots.left">
      <slot name="left"></slot>
    </template>
    
    <!-- 标题插槽 -->
    <template #title v-if="$slots.title">
      <slot name="title"></slot>
    </template>
    
    <!-- 右侧插槽 -->
    <template #right v-if="$slots.right">
      <slot name="right"></slot>
    </template>
  </van-nav-bar>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  // 标题
  title: {
    type: String,
    default: ''
  },
  // 是否显示返回按钮
  showBack: {
    type: Boolean,
    default: true
  },
  // 左侧文本
  leftText: {
    type: String,
    default: ''
  },
  // 右侧文本
  rightText: {
    type: String,
    default: ''
  },
  // 是否固定在顶部
  fixed: {
    type: Boolean,
    default: true
  },
  // 背景颜色
  backgroundColor: {
    type: String,
    default: '#ffffff'
  }
})

// 定义事件
const emit = defineEmits(['click-left', 'click-right'])

// 点击左侧按钮
const onClickLeft = () => {
  emit('click-left')
  // 如果没有自定义处理，则默认返回上一页
  if (!emit.length) {
    router.back()
  }
}

// 点击右侧按钮
const onClickRight = () => {
  emit('click-right')
}
</script>

<style lang="scss" scoped>
:deep(.van-nav-bar) {
  background-color: transparent;
}
</style> 