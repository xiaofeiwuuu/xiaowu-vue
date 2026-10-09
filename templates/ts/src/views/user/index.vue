<template>
  <div class="user">
    <h1>用户中心</h1>

    <van-button type="primary" @click="handleLogout">退出登录</van-button>
  </div>
</template>

<script setup lang="ts">
import { showDialog } from 'vant'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()

const handleLogout = () => {
  showDialog({
    title: '提示',
    message: '确定要退出登录吗？',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    showCancelButton: true
  }).then(() => {
    userStore.logout()
  })
}
</script>

<style lang="scss" scoped>
.user {
  padding: 20px;
}
</style> 