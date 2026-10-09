import request from '@/utils/request'
import type { LoginParams, RegisterParams, UserInfo } from '@/types/api'

export interface LoginResponse extends UserInfo {
  token: string
}

export const login = (data: LoginParams) => {
  return request.post<LoginResponse>('/auth/login', data)
}

export const register = (data: RegisterParams) => {
  return request.post<UserInfo>('/auth/register', data)
}

export const logout = () => {
  return request.post<null>('/auth/logout')
}

export const sendVerifyCode = (phone: string) => {
  return request.post<{ code: string }>('/auth/verify-code', { phone })
}

export const checkInviteCode = (code: string) => {
  return request.get<boolean>(`/auth/check-invite/${code}`)
} 