<template>
    <div class="user">
      <h1>用户中心</h1>
      <!-- @theme-switch -->
  
      <van-button type="primary" @click="handleLogout">退出登录</van-button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { Dialog } from 'vant'
  import { useUserStore } from '@/store/modules/user'
  
  const userStore = useUserStore()
  const router = useRouter()
  
  const handleLogout = (): void => {
    Dialog.confirm({
      title: '提示',
      message: '确定要退出登录吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(() => {
        userStore.logout()
        router.push('/auth/login')
      })
      .catch(() => {
        // 用户取消操作，不做处理
      })
  }
  </script>
  
  <style lang="scss" scoped>
  .user {
    padding: 20px;
  }
  </style> 