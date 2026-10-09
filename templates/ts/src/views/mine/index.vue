<template>
  <div class="mine">
    <h1 class="title">用户中心</h1>
    <!-- @theme-switch -->

    <div class="logout-btn">
      <van-button round block type="primary" @click="handleLogout">退出登录</van-button>
    </div>
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
    .then(async () => {
      await userStore.logout()
      router.push('/auth/login')
    })
    .catch(() => {
      // 用户取消操作，不做处理
    })
}
</script>

<style lang="scss" scoped>
.mine {
  padding-top: 8px;

  .title {
    padding: 16px;
    font-size: 20px;
    font-weight: 600;
    color: var(--van-text-color);
  }

  .logout-btn {
    margin: 24px 16px;
  }
}
</style>
