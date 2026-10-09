import request from '@/utils/request'
import type { ApiResponse, UserInfo } from '@/types/api'

interface LoginData {
  username: string
  password: string
}

export interface UpdateUserParams {
  nickname?: string
  avatar?: string
  password?: string
  oldPassword?: string
}

export function login(data: LoginData) {
  return request.post<ApiResponse<UserInfo>>('/user/login', data)
}

export const getUserInfo = () => {
  return request.get<ApiResponse<UserInfo>>('/user/info')
}

export const updateUserInfo = (data: UpdateUserParams) => {
  return request.put<ApiResponse<UserInfo>>('/user/info', data)
}

export const updateAvatar = (file: File) => {
  const formData = new FormData()
  formData.append('avatar', file)
  return request.post<ApiResponse<{ url: string }>>('/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const changePassword = (data: { oldPassword: string; newPassword: string }) => {
  return request.post<ApiResponse<null>>('/user/change-password', data)
} 