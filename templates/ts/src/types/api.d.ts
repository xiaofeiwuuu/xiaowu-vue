// 用户相关接口
export interface LoginParams {
  username: string
  password: string
}

export interface RegisterParams {
  username: string
  password: string
  code?: string
  inviteCode?: string
}

export interface UserInfo {
  id: number | string
  username: string
  nickname?: string
  avatar?: string
  role?: string
  token?: string
}

// 响应数据结构
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  message: string
}

// 分页参数
export interface PaginationParams {
  page: number
  pageSize: number
}

// 分页响应
export interface PaginationResponse<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
} 