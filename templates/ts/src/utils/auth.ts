import { storage } from './storage'
import type { UserInfo } from '@/types/api'

const TOKEN_KEY = 'auth_token'  // 保存 token 的 key
const USER_KEY = 'user_info'    // 保存用户信息的 key

interface LoginInfo {
  token?: string
  userInfo?: UserInfo
}

/**
 * 保存登录信息
 * @param data 登录信息
 */
export function saveLoginInfo(data: LoginInfo): void {
  // 保存 token
  if (data.token) {
    storage.set(TOKEN_KEY, data.token)
  }

  // 保存用户信息
  if (data.userInfo) {
    storage.set(USER_KEY, data.userInfo)
  }
}

/**
 * 获取 token
 * @returns token字符串或null
 */
export function getToken(): string | null {
  return storage.get<string>(TOKEN_KEY)
}

/**
 * 获取用户信息
 * @returns 用户信息对象或null
 */
export function getUserInfo(): UserInfo | null {
  return storage.get<UserInfo>(USER_KEY)
}

/**
 * 清除所有认证信息
 */
export function clearAuth(): void {
  storage.remove(TOKEN_KEY)
  storage.remove(USER_KEY)
}

/**
 * 检查是否已登录
 * @returns 是否已登录
 */
export function isLoggedIn(): boolean {
  return !!getToken() && !!getUserInfo()
}