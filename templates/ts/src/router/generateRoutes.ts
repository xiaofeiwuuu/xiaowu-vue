import { DEFAULT_META, getMetaConfig } from './metaConfig';
import type { AppRouteRecordRaw } from './types';

// 自动导入 views 目录下的所有 .vue 文件
const modules = import.meta.glob('../views/**/*.vue');
// 定义需要忽略的文件名
const ignoreFiles: string[] = ['layout', 'Layout'];

/**
 * 格式化路由路径
 * @param {string} componentPath - 组件文件路径
 * @returns {string} 格式化后的路由路径
 * 
 * 例如：
 * UserProfile.vue -> user-profile
 * user/LoginPage.vue -> user/login-page
 * auth/index.vue -> auth
 */
function formatRoutePath(componentPath: string): string {
  return componentPath
    .replace(/\.vue$/, '')         // 删除 .vue 后缀
    .replace(/\/index$/, '')       // 删除 /index 后缀
    .replace(/([A-Z])/g, '-$1')   // 大写字母前添加连字符（UserProfile -> -User-Profile）
    .toLowerCase()                 // 转换为小写 (-User-Profile -> -user-profile)
    .replace(/^-/, '');            // 删除开头的连字符 (-user-profile -> user-profile)
}

/**
 * 生成路由配置
 * @returns {Array} 路由配置数组
 */
export default function generateRoutes(): AppRouteRecordRaw[] {
  const routes: AppRouteRecordRaw[] = [];

  // 遍历所有的 .vue 文件
  for (const path in modules) {
    // 获取相对于 views 目录的路径
    const componentPath = path.replace('../views/', '');
    
    // 跳过包含 layout 或 Layout 的文件
    if (ignoreFiles.some(ignore => componentPath.includes(ignore))) {
      continue;
    }

    // 格式化路由路径
    const routePath = formatRoutePath(componentPath);

    // 开发环境下打印路由信息
    if (import.meta.env.DEV) {
      console.log('原始路径:', componentPath);
      console.log('转换后的路由路径:', routePath);
    }

    // 添加路由配置
    routes.push({
      path: '/' + routePath,                // 路由路径
      component: modules[path],             // 懒加载组件
      meta: getMetaConfig(routePath),       // 获取路由元信息配置
    });
  }

  // 开发环境下打印生成的路由配置
  if (import.meta.env.DEV) {
    console.log('生成的路由配置:', routes);
  }

  return routes;
}