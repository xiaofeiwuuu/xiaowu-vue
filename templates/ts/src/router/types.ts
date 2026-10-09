import type { RouteComponent, RouteLocationNormalized } from 'vue-router'

export interface RouteMeta {
  title?: string
  hideTabbar?: boolean
  keepAlive?: boolean
  requiresAuth?: boolean
  roles?: string[]
}

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