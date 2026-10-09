import { defineStore } from 'pinia'
import { saveLoginInfo, clearAuth } from '@/utils/auth'
import { login, logout as logoutApi } from '@/api/auth'
import { getUserInfo } from '@/api/user'
import { showToast } from 'vant'
import type { UserState } from '../types'
import type { LoginParams, UserInfo } from '@/types/api'

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    userInfo: null,
    token: null,
  }),

  getters: {
    isLogin: (state): boolean => !!state.token,
  },

  actions: {
    async login(loginForm: LoginParams): Promise<boolean> {
      try {
        const { data } = await login(loginForm)
        const { token, ...userInfo } = data
        
        this.token = token
        this.userInfo = userInfo
        saveLoginInfo({ token, userInfo })
        
        showToast('登录成功')
        return true
      } catch (error) {
        console.log(error);
        
        return false
      }
    },

    async getUserInfo(): Promise<UserInfo | null> {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data
        return data
      } catch (error) {
        console.log(error);
        return null
      }
    },

    async logout(): Promise<void> {
      try {
        await logoutApi()
        this.resetUserInfo()
        showToast('已退出登录')
      } catch (error) {
        console.log(error);
      }
    },

    resetUserInfo(): void {
      this.token = null
      this.userInfo = null
      clearAuth()
    }
  }
}) 