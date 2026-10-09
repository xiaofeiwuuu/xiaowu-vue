import { createRouter, createWebHistory } from 'vue-router'
import generateRoutes from './generateRoutes'
import { isLoggedIn } from '@/utils/auth'
import { showDialog } from 'vant'
import type { AppRouteRecordRaw } from './types'
import type { RouteRecordRaw } from 'vue-router'
// 生成路由配置
const routes: AppRouteRecordRaw[] = generateRoutes()
console.log(routes);

// 添加根路由重定向
routes.unshift({
  path: '/',
  redirect: '/home'
})

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[]
})

// 白名单路由（无需登录即可访问）
const whiteList: string[] = ['/home', '/auth/login', '/auth/register']

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  document.title = (to.meta?.title as string) || (import.meta.env.VITE_TITLE as string) || 'xiaofeiwuuu'
  
  // 在白名单中的路由直接放行
  if (whiteList.includes(to.path)) {
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
        cancelButtonText: '取消'
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