<template>
  <van-cell-group inset>
    <van-cell center title="深色模式">
      <template #right-icon>
        <van-switch :model-value="isDark" size="22px" @update:model-value="toggleTheme" />
      </template>
    </van-cell>
    <van-cell center title="跟随系统">
      <template #right-icon>
        <van-switch :model-value="mode === null" size="22px" @update:model-value="onFollowSystem" />
      </template>
    </van-cell>
  </van-cell-group>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { isDark, mode, setTheme, toggleTheme } = useTheme()

// 打开：恢复跟随系统；关闭：固定为当前显示的主题
const onFollowSystem = (follow: boolean): void => setTheme(follow ? null : isDark.value ? 'dark' : 'light')
</script>
