// metaConfig.js
/**
 * 默认的路由元信息配置
 * hideTabbar: 是否隐藏底部导航栏
 * keepAlive: 是否启用页面缓存
 */
export const DEFAULT_META = {
    hideTabbar: false,  // 默认显示底部导航栏
    keepAlive: true,    // 默认启用页面缓存
    title: import.meta.env.VITE_TITLE,
};
  
  /**
   * 根据路由路径获取元信息配置
   * @param {string} routePath - 路由路径
   * @returns {Object} 路由元信息配置
   * 
   * 示例：
   * auth/login -> { hideTabbar: true, keepAlive: false }
   * admin/users -> { hideTabbar: false, keepAlive: true }
   */
  export function getMetaConfig(routePath) {
    // 克隆默认配置
    const meta = { ...DEFAULT_META };
  
    // auth 目录下的页面（登录、注册等）
    if (routePath.startsWith('auth/')) {
      meta.hideTabbar = true;    // 隐藏底部导航栏
      meta.keepAlive = false;    // 禁用页面缓存
    }
  
    return meta;
  }