<template>
  <div class="login-container">

    <div class="login-content">
      <div class="login-header">
        <h2>欢迎登录</h2>
        <p>请输入您的账号和密码</p>
      </div>

      <van-form @submit="onSubmit" class="login-form">
        <van-cell-group inset>
          <van-field
            v-model="loginForm.username"
            name="username"
            label="用户名"
            placeholder="请输入用户名/手机号"
            maxlength="20"
            :rules="[{ required: true, message: '请输入用户名' }]"
          ></van-field>
          
          <van-field
            v-model="loginForm.password"
            :type="showPassword ? 'text' : 'password'"
            name="password"
            label="密码"
            placeholder="请输入密码"
            maxlength="20"
            :rules="[
              { required: true, message: '请输入密码' },
              { pattern: /^[a-zA-Z0-9]+$/, message: '密码只能包含字母和数字' }
            ]"
            :formatter="passwordFormatter"
            :right-icon="showPassword ? 'eye-o' : 'closed-eye'"
            @click-right-icon="showPassword = !showPassword"
          ></van-field>
        </van-cell-group>

        <div class="form-options">
          <van-checkbox v-model="agreeProtocol" shape="square" class="protocol-checkbox">
            我已阅读并同意
            <span class="protocol-link" @click.stop="showProtocol">《用户协议》</span>
          </van-checkbox>
        </div>

        <div class="submit-btn">
          <van-button 
            round 
            block 
            type="primary" 
            native-type="submit"
            :loading="loading"
            loading-text="登录中..."
          >
            登录
          </van-button>
        </div>

        <div class="register-link">
          还没有账号？<router-link to="/auth/register">立即注册</router-link>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { showToast, showDialog } from 'vant'
import { useUserStore } from '@/store/modules/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// 按钮状态
const loading = ref(false)

// 密码显示状态
const showPassword = ref(false)

// 登录表单
const loginForm = reactive({
  username: '', // 用户名
  password: '' // 密码
})

// 是否同意协议
const agreeProtocol = ref(false)

// 显示协议
const showProtocol = () => {
  showDialog({
    title: '用户协议',
    message: '这里是用户协议的具体内容...',
    confirmButtonText: '我知道了'
  })
}

const onSubmit = async () => {
  if (!agreeProtocol.value) {
    try {
      await showDialog({
        title: '温馨提示',
        message: '请先阅读并同意用户协议',
        confirmButtonText: '同意协议',
        cancelButtonText: '暂不同意',
        showCancelButton: true
      })
      // 用户点击确认，自动勾选协议
      agreeProtocol.value = true
      // 继续执行登录
      handleLogin()
    } catch {
      // 用户点击取消，不执行任何操作
      return
    }
  } else {
    handleLogin()
  }
}

const handleLogin = async () => {
  try {
    loading.value = true
    
    // 准备登录数据（密码加密）
    const loginData = {
      username: loginForm.username,
      password: loginForm.password
    }
    
    // 调用 store 的登录方法
    await userStore.login(loginData)

    showToast('登录成功')

    // 获取重定向地址
    const redirect = route.query.redirect || '/home'
    router.replace(redirect)
  } catch (error) {
    console.error('登录失败',error)
  } finally {
    loading.value = false
  }
}

const passwordFormatter = (value) => value.replace(/[^a-zA-Z0-9]/g, '')
</script>

<style lang="scss" scoped>
.login-container {

  .login-content {
    padding: 20px;
  }

  .login-header {
    text-align: center;
    margin: 40px 0;

    h2 {
      font-size: 24px;
      color: var(--van-text-color);
      margin-bottom: 10px;
    }

    p {
      color: var(--app-text-secondary);
      font-size: 14px;
    }
  }

  .login-form {
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 16px;
      font-size: 14px;

      .protocol-checkbox {
        font-size: 14px;
        color: var(--app-text-secondary);
      }

      .protocol-link {
        color: var(--van-primary-color);
      }

      .forget-pwd {
        color: var(--van-primary-color);
      }
    }

    .submit-btn {
      margin: 24px 16px;
    }

    .register-link {
      text-align: center;
      font-size: 14px;
      color: var(--app-text-secondary);

      a {
        color: var(--van-primary-color);
        text-decoration: underline;
      }
    }
  }
}
</style>
