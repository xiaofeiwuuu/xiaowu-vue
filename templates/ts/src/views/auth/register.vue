<template>
  <div class="register-container">
    <nav-bar title="注册" :show-back="false"/>
    
    <van-form @submit="onSubmit" class="register-form">
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
        <van-field
          v-model="formData.confirmPassword"
          type="password"
          name="confirmPassword"
          label="确认密码"
          placeholder="请再次输入密码"
          :rules="[
            { required: true, message: '请确认密码' },
            { validator: validateConfirmPassword, message: '两次输入的密码不一致' }
          ]"
        />
        <van-field
          v-model="formData.inviteCode"
          name="inviteCode"
          label="邀请码"
          placeholder="请输入邀请码（选填）"
        />
      </van-cell-group>

      <div class="form-actions">
        <van-button round block type="primary" native-type="submit" :loading="loading">
          注册
        </van-button>
      </div>

      <div class="form-links">
        <router-link to="/auth/login" class="login-link">
          已有账号？立即登录
        </router-link>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { showNotify } from 'vant'
import { register } from '@/api/auth'
import type { RegisterParams } from '@/types/api'

const router = useRouter()
const route = useRoute()
const loading = ref(false)

interface FormData extends RegisterParams {
  username: string
  password: string
  confirmPassword: string
  inviteCode: string
}

const formData = ref<FormData>({
  username: '',
  password: '',
  confirmPassword: '',
  inviteCode: route.query.inviteCode as string || ''
})

// 监听路由参数变化，更新邀请码
watch(
  () => route.query.inviteCode,
  (newCode) => {
    if (newCode) {
      formData.value.inviteCode = newCode as string
    }
  }
)

const validateConfirmPassword = (value: string): boolean => {
  return value === formData.value.password
}

const onSubmit = async () => {
  try {
    loading.value = true
    const { confirmPassword, ...registerData } = formData.value
    await register(registerData)
    showNotify({ type: 'success', message: '注册成功' })
    router.replace('/auth/login')
  } catch (error) {
    // 错误已在请求拦截器中处理
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.register-container {
  min-height: 100vh;
  background-color: var(--van-background);
  
  .register-form {
    padding: 16px;
    
    .form-actions {
      margin: 16px;
    }
    
    .form-links {
      margin-top: 16px;
      text-align: center;
      
      .login-link {
        color: var(--van-primary-color);
        font-size: 14px;
      }
    }
  }
}
</style> 