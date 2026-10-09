<template>
  <div class="login-container">
    <nav-bar title="登录" :show-back="false"></nav-bar>

    <van-form @submit="onSubmit" class="login-form">
      <van-cell-group inset>
        <van-field
          v-model="formData.username"
          name="username"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ required: true, message: '请输入用户名' }]"
        />
        <van-field
          v-model="formData.password"
          type="password"
          name="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]"
        />
      </van-cell-group>

      <div class="form-actions">
        <van-button round block type="primary" native-type="submit" :loading="loading">
          登录
        </van-button>
      </div>

      <div class="form-links">
        <router-link to="/auth/register" class="register-link">
          没有账号？立即注册
        </router-link>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import type { LoginParams } from '@/types/api'
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const loading = ref(false)

interface FormData extends LoginParams {
  username: string
  password: string
}

const formData = ref<FormData>({
  username: '',
  password: '',
})

const onSubmit = async () => {
  try {
    loading.value = true
    const loginData = {
      username: formData.value.username,
      password: formData.value.password
    }
    const success = await userStore.login(loginData)
    
    if (success) {
      const redirect = route.query.redirect as string || '/'
      router.replace(redirect)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background-color: var(--van-background);
  
  .login-form {
    padding: 16px;
    
    .form-actions {
      margin: 16px;
    }
    
    .form-links {
      margin-top: 16px;
      text-align: center;
      
      .register-link {
        color: var(--van-primary-color);
        font-size: 14px;
        text-decoration: underline;
      }
    }
  }
}
</style> 