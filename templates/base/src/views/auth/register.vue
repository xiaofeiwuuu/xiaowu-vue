<template>
  <div class="register-container safe-top">
    <div class="register-content">
      <div class="register-header">
        <h2>欢迎注册</h2>
        <p>请填写以下信息完成注册</p>
      </div>

      <van-form @submit="handleRegister" class="register-form">
        <van-cell-group inset>
          <van-field
            v-model="formData.username"
            name="username"
            label="用户名"
            placeholder="请输入用户名"
            maxlength="20"
            :rules="[
              { required: true, message: '请输入用户名' },
              { pattern: /^[a-zA-Z0-9]+$/, message: '用户名只能包含字母和数字' }
            ]"
            :formatter="usernameFormatter"
          ></van-field>
          
          <van-field
            v-model="formData.phone"
            name="phone"
            label="手机号"
            placeholder="请输入手机号"
            maxlength="11"
            :rules="[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
            ]"
            :formatter="mobileFormatter"
          >
          </van-field>

          <van-field
            v-model="formData.code"
            center
            label="验证码"
            placeholder="请输入验证码"
            maxlength="6"
            :rules="[
              { required: true, message: '请输入验证码' },
              { pattern: /^\d{6}$/, message: '验证码为6位数字' }
            ]"
            :formatter="verifyCodeFormatter"
          >
            <template #button>
              <van-button
                size="small"
                type="primary"
                :disabled="isCountingDown"
                @click="handleSendCode"
              >
                {{ countDownText }}
              </van-button>
            </template>
          </van-field>
          
          <van-field
            v-model="formData.password"
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

          <van-field
            v-model="formData.confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            name="confirmPassword"
            label="确认密码"
            placeholder="请再次输入密码"
            maxlength="20"
            :rules="[
              { required: true, message: '请再次输入密码' },
              { validator: validateConfirmPassword, message: '两次输入的密码不一致' }
            ]"
            :formatter="passwordFormatter"
            :right-icon="showConfirmPassword ? 'eye-o' : 'closed-eye'"
            @click-right-icon="showConfirmPassword = !showConfirmPassword"
          ></van-field>

          <van-field
            v-model="formData.inviteCode"
            name="inviteCode"
            label="邀请码"
            placeholder="请输入邀请码（选填）"
            maxlength="20"
            :formatter="inviteCodeFormatter"
          ></van-field>
        </van-cell-group>

        <div class="submit-btn">
          <van-button 
            round 
            block 
            type="primary" 
            native-type="submit"
            :loading="loading"
            loading-text="注册中..."
          >
            注册
          </van-button>
        </div>

        <div class="login-link">
          已有账号？<router-link to="/auth/login">立即登录</router-link>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { register, sendVerifyCode } from '@/api/auth'

const router = useRouter()
const route = useRoute()

// 密码显示状态
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// 按钮状态
const loading = ref(false)

// 倒计时相关
const countdown = ref(60)
const isCountingDown = ref(false)
const countDownText = computed(() => {
  return isCountingDown.value ? `${countdown.value}s` : '发送验证码'
})

// 表单数据
const formData = reactive({
  username: '',
  phone: '',
  code: '',
  password: '',
  confirmPassword: '',
  inviteCode: route.query.inviteCode || '' // 从 URL 获取邀请码
})

// 监听路由参数变化
watch(
  () => route.query.inviteCode,
  (newInviteCode) => {
    if (newInviteCode) {
      formData.inviteCode = newInviteCode
    }
  }
)

// 格式化函数
const usernameFormatter = (value) => value.replace(/[^a-zA-Z0-9]/g, '')
const passwordFormatter = (value) => value.replace(/[^a-zA-Z0-9]/g, '')
const mobileFormatter = (value) => value.replace(/\D/g, '')
const verifyCodeFormatter = (value) => value.replace(/\D/g, '')
const inviteCodeFormatter = (value) => value.replace(/[^a-zA-Z0-9]/g, '')

// 确认密码验证
const validateConfirmPassword = (value) => {
  return value === formData.password
}

// 发送验证码
const handleSendCode = async () => {
  if (!formData.phone) {
    showToast('请输入手机号')
    return
  }
  
  try {
    isCountingDown.value = true
    await sendVerifyCode(formData.phone)
    showToast('验证码已发送')
    
    // 开始倒计时
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        isCountingDown.value = false
        countdown.value = 60
      }
    }, 1000)
  } catch (error) {
    isCountingDown.value = false
    console.error('发送验证码失败',error)
  }
}

// 处理注册
const handleRegister = async () => {
  try {
    loading.value = true
    
    // 调用注册接口
    await register({
      username: formData.username,
      phone: formData.phone,
      code: formData.code,
      password: formData.password,
      inviteCode: formData.inviteCode
    })

    showToast('注册成功')

    // 注册成功后跳转到登录页
    router.push('/auth/login')
  } catch (error) {
    console.error('注册失败',error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.register-container {

  .register-content {
    padding: 20px;
  }

  .register-header {
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

  .register-form {
    .submit-btn {
      margin: 24px 16px;
    }

    .login-link {
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