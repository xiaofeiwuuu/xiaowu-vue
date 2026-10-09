<template>
  <van-nav-bar
    :title="title"
    :left-text="leftText"
    :right-text="rightText"
    :left-arrow="showBack"
    :placeholder="placeholder"
    :safe-area-inset-top="safeAreaInsetTop"
    :border="border"
    :z-index="zIndex"
    :style="{ backgroundColor }"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  >
    <template #left v-if="$slots.left">
      <slot name="left" />
    </template>
    <template #title v-if="$slots.title">
      <slot name="title" />
    </template>
    <template #right v-if="$slots.right">
      <slot name="right" />
    </template>
  </van-nav-bar>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Props {
  title?: string
  leftText?: string
  rightText?: string
  showBack?: boolean
  fixed?: boolean
  placeholder?: boolean
  safeAreaInsetTop?: boolean
  border?: boolean
  zIndex?: number | string
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  leftText: '',
  rightText: '',
  showBack: true,
  fixed: true,
  placeholder: true,
  safeAreaInsetTop: true,
  border: true,
  zIndex: 100,
  backgroundColor: 'var(--van-background-2)'
})

const emit = defineEmits<{
  (e: 'click-left'): void
  (e: 'click-right'): void
}>()

const router = useRouter()

const onClickLeft = () => {
  emit('click-left')
  if (props.showBack) {
    router.back()
  }
}

const onClickRight = () => {
  emit('click-right')
}
</script>

<style lang="scss" scoped>
:deep(.van-nav-bar) {
  background-color: transparent;
}
</style> 