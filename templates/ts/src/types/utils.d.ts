// 通用类型
export type Nullable<T> = T | null

// 函数类型
export type Fn<T = any, R = T> = (...args: T[]) => R

// 异步函数类型
export type PromiseFn<T = any, R = T> = (...args: T[]) => Promise<R>

// 对象类型
export type Recordable<T = any> = Record<string, T>

// 时间格式化选项
export interface TimeFormatOptions {
  format?: string
  timezone?: string
}

// 加密选项
export interface EncryptOptions {
  key?: string
  iv?: string
  mode?: string
}

// 存储选项
export interface StorageOptions {
  prefix?: string
  expire?: number
  crypto?: boolean
} 