import { createRouter, createWebHistory } from 'vue-router'
import generateRoutes from './generateRoutes'
import { isLoggedIn } from '@/utils/auth'
import { showDialog } from 'vant'

// 生成路由配置
const routes = generateRoutes()

// 添加根路由重定向
routes.unshift({
  path: '/',
  redirect: '/home'
})

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || import.meta.env.VITE_TITLE || 'xiaofeiwuuu'
  
  // 无需登录的页面直接放行（在 router/metaConfig 中通过 requiresAuth 声明）
  if (!to.meta.requiresAuth) {
    next()
    return
  }

  // 获取token
  const hasToken = isLoggedIn()
  
  // 其他页面需要验证登录状态
  if (hasToken) {
    next()
  } else {
    try {
      await showDialog({
        title: '温馨提示',
        message: '该功能需要登录后才能使用，是否立即登录？',
        confirmButtonText: '去登录',
        cancelButtonText: '取消',
        showCancelButton: true
      })
      // 用户点击确认，跳转登录页
      next(`/auth/login?redirect=${encodeURIComponent(to.fullPath)}`)
    } catch {
      // 用户点击取消，返回上一页
      if (from.path) {
        next(false)
      } else {
        // 如果没有来源页面，跳转到首页
        next('/home')
      }
    }
  }
})

export default router 