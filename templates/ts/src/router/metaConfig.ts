import type { RouteMeta } from './types'

// 无需登录即可访问的页面（路径相对于 views 目录，不含 .vue）
const PUBLIC_ROUTES: string[] = ['home'];

/**
 * 默认的路由元信息配置
 * hideTabbar: 是否隐藏底部导航栏
 * keepAlive: 是否启用页面缓存
 * requiresAuth: 是否需要登录才能访问（默认需要，新增页面默认受保护）
 */
export const DEFAULT_META: RouteMeta = {
    hideTabbar: false,  // 默认显示底部导航栏
    keepAlive: true,    // 默认启用页面缓存
    requiresAuth: true, // 默认需要登录
    title: import.meta.env.VITE_TITLE as string || '移动端模板'
};
  
/**
 * 根据路由路径获取元信息配置
 * @param routePath - 路由路径
 * @returns 路由元信息配置
 * 
 * 示例：
 * auth/login -> { hideTabbar: true, keepAlive: false, requiresAuth: false }
 * admin/users -> { hideTabbar: false, keepAlive: true, requiresAuth: true }
 */
export function getMetaConfig(routePath: string): RouteMeta {
    // 克隆默认配置
    const meta: RouteMeta = { ...DEFAULT_META };
  
    // auth 目录下的页面（登录、注册等）
    if (routePath.startsWith('auth/')) {
      meta.hideTabbar = true;    // 隐藏底部导航栏
      meta.keepAlive = false;    // 禁用页面缓存
      meta.requiresAuth = false; // 登录、注册无需登录
      meta.title = routePath.includes('login') ? '登录' : '注册';
    }
  
    // 公开页面：在这里按路径声明无需登录的页面
    if (PUBLIC_ROUTES.includes(routePath)) {
      meta.requiresAuth = false;
    }

    return meta;
}