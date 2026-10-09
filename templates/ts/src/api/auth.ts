import request from '@/utils/request'
import type { LoginParams, RegisterParams, ApiResponse, UserInfo } from '@/types/api'

export interface LoginResponse extends UserInfo {
  token: string
}

export const login = (data: LoginParams) => {
  return request.post<ApiResponse<LoginResponse>>('/auth/login', data)
}

export const register = (data: RegisterParams) => {
  return request.post<ApiResponse<UserInfo>>('/auth/register', data)
}

export const logout = () => {
  return request.post<ApiResponse<null>>('/auth/logout')
}

export const sendVerifyCode = (phone: string) => {
  return request.post<ApiResponse<{ code: string }>>('/auth/verify-code', { phone })
}

export const checkInviteCode = (code: string) => {
  return request.get<ApiResponse<boolean>>(`/auth/check-invite/${code}`)
} 