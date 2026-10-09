import { localStorage } from './storage'

const TOKEN_KEY = 'auth_token'  // 保存 token 的 key
const USER_KEY = 'user_info'    // 保存用户信息的 key

/**
 * 保存登录信息
 * @param {Object} data 登录信息
 */
export function saveLoginInfo(data) {
  // 保存 token
  if (data.token) {
    localStorage.set(TOKEN_KEY, data.token)
  }

  // 保存用户信息
  if (data.userInfo) {
    localStorage.set(USER_KEY, data.userInfo)
  }
}

/**
 * 获取 token
 * @returns {string|null}
 */
export function getToken() {
  return localStorage.get(TOKEN_KEY)
}

/**
 * 获取用户信息
 * @returns {Object|null}
 */
export function getUserInfo() {
  return localStorage.get(USER_KEY)
}

/**
 * 清除所有认证信息
 */
export function clearAuth() {
  localStorage.remove(TOKEN_KEY)
  localStorage.remove(USER_KEY)
}

/**
 * 检查是否已登录
 * @returns {boolean}
 */
export function isLoggedIn() {
  return !!getToken() && !!getUserInfo()
}