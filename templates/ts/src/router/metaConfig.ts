// metaConfig.js
import type { RouteMeta } from './types'

/**
 * 默认的路由元信息配置
 * hideTabbar: 是否隐藏底部导航栏
 * keepAlive: 是否启用页面缓存
 */
export const DEFAULT_META: RouteMeta = {
    hideTabbar: false,  // 默认显示底部导航栏
    keepAlive: true,    // 默认启用页面缓存
    title: import.meta.env.VITE_TITLE as string || '移动端模板'
};
  
/**
 * 根据路由路径获取元信息配置
 * @param routePath - 路由路径
 * @returns 路由元信息配置
 * 
 * 示例：
 * auth/login -> { hideTabbar: true, keepAlive: false }
 * admin/users -> { hideTabbar: false, keepAlive: true }
 */
export function getMetaConfig(routePath: string): RouteMeta {
    // 克隆默认配置
    const meta: RouteMeta = { ...DEFAULT_META };
  
    // auth 目录下的页面（登录、注册等）
    if (routePath.startsWith('auth/')) {
      meta.hideTabbar = true;    // 隐藏底部导航栏
      meta.keepAlive = false;    // 禁用页面缓存
      meta.title = routePath.includes('login') ? '登录' : '注册';
    }
  
    return meta;
}