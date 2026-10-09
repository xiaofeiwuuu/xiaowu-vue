// 通用类型
export type Nullable<T> = T | null

// 函数类型
export type Fn<Args extends unknown[] = never[], R = void> = (...args: Args) => R

// 异步函数类型
export type PromiseFn<Args extends unknown[] = never[], R = void> = (...args: Args) => Promise<R>

// 对象类型
export type Recordable<T = unknown> = Record<string, T>

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