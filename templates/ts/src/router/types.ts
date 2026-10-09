import type { RouteComponent, RouteLocationNormalized, RouteMeta } from 'vue-router'

// 扩充 vue-router 的 RouteMeta，使 route.meta.xxx 拥有类型提示
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    hideTabbar?: boolean
    keepAlive?: boolean
    // 是否需要登录（默认 true，见 router/metaConfig.ts）
    requiresAuth?: boolean
    // 角色仅用于界面层的显隐，真正的权限校验必须由后端完成
    roles?: string[]
  }
}

export type { RouteMeta }

// 简化的自定义路由类型
export type AppRouteRecordRaw = {
  path: string
  name?: string
  component?: RouteComponent | (() => Promise<RouteComponent>)
  children?: AppRouteRecordRaw[]
  redirect?: string | { name: string }
  meta?: RouteMeta
  props?: boolean | Record<string, unknown> | ((to: RouteLocationNormalized) => Record<string, unknown>)
} 