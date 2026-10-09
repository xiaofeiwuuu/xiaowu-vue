<template>
    <div class="user">
      <h1>用户中心</h1>
  
      <van-button type="primary" @click="handleLogout">退出登录</van-button>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/store/modules/user'
  const userStore = useUserStore()
  const router = useRouter()
  
  const handleLogout = () => {
    showDialog({
      title: '提示',
      message: '确定要退出登录吗？',
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      showCancelButton: true
    }).then(() => {
      userStore.logout()
      router.push('/auth/login')
    })
  }
  </script>
  
  <style lang="scss" scoped>
  .user {
    padding: 20px;
  }
  </style> 