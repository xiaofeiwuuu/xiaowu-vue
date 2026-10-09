import request from '@/utils/request'
import type { UserInfo } from '@/types/api'

export interface UpdateUserParams {
  nickname?: string
  avatar?: string
  password?: string
  oldPassword?: string
}

export const getUserInfo = () => {
  return request.get<UserInfo>('/user/info')
}

export const updateUserInfo = (data: UpdateUserParams) => {
  return request.put<UserInfo>('/user/info', data)
}

export const updateAvatar = (file: File) => {
  const formData = new FormData()
  formData.append('avatar', file)
  return request.post<{ url: string }>('/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export const changePassword = (data: { oldPassword: string; newPassword: string }) => {
  return request.post<null>('/user/change-password', data)
} 