import { defineStore } from 'pinia'
import { saveLoginInfo, clearAuth } from '@/utils/auth'
import { login, logout as logoutApi } from '@/api/auth'
import { getUserInfo } from '@/api/user'
import { showToast } from 'vant'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: null
  }),

  getters: {
    // 是否已登录
    isLoggedIn: (state) => !!state.token && !!state.userInfo
  },

  actions: {
    // 设置 token
    setToken(token) {
      this.token = token
    },

    // 设置用户信息
    setUserInfo(info) {
      this.userInfo = info
    },

    // 登录
    async login(loginData) {
      try {
        // 调用登录接口
        const { data } = await login(loginData)
        
        // 保存 token
        this.setToken(data.token)
        saveLoginInfo({ token: data.token })
        
        // 获取用户信息
        await this.getUserInfo()
        
        return true
      } catch (error) {
        console.log('登录失败',error)
        throw error
      }
    },

    // 获取用户信息
    async getUserInfo() {
      try {
        const { data } = await getUserInfo()
        
        // 保存用户信息
        this.setUserInfo(data)
        saveLoginInfo({ userInfo: data })
        
        return data
      } catch (error) {
        console.log('获取用户信息失败',error)
        throw error
      }
    },

    // 退出登录
    async logout() {
      try {
        await logoutApi()
        this.setToken('')
        this.setUserInfo(null)
        clearAuth()
        showToast('退出登录成功')
      } catch (error) {
        console.log('退出登录失败',error)
        throw error
      }
    }
  }
}) 