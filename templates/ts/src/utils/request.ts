import axios, { 
  type AxiosInstance, 
  type AxiosRequestConfig, 
  type AxiosResponse, 
  type AxiosError,
  type InternalAxiosRequestConfig
} from 'axios'
import { showToast } from 'vant'
import { useUserStore } from '@/store/modules/user'
import router from '@/router'
import { sleep } from '@/utils/common'
import type { ApiResponse } from '@/types/api'

// 扩展 AxiosRequestConfig 类型
interface RequestOptions extends AxiosRequestConfig {
  // 是否显示错误提示
  noToast?: boolean
  // 失败重试次数（仅网络错误和 5xx）。未设置时：GET / HEAD / OPTIONS 重试 3 次，其他方法不重试，避免重复提交
  retry?: number
  // 重试间隔（毫秒），默认 1000
  retryDelay?: number
  // 内部使用：已重试次数
  __retryCount?: number
  // 内部使用：请求唯一标识，请求阶段生成，避免响应阶段 data 已被序列化导致 key 不一致
  __requestKey?: string
  // 是否需要 token
  requiresAuth?: boolean
  // 是否返回原始响应
  returnRaw?: boolean
}

// 业务成功状态码
const SUCCESS_CODE = 200

// 重试默认值
const DEFAULT_RETRY = 3
const DEFAULT_RETRY_DELAY = 1000
const IDEMPOTENT_METHODS = ['get', 'head', 'options']

// 错误消息映射
const ERROR_MESSAGES: Record<number, string> = {
  400: '请求参数错误',
  401: '未授权，请重新登录',
  403: '拒绝访问',
  404: '请求地址不存在',
  408: '请求超时',
  500: '服务器内部错误',
  501: '服务未实现',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
  505: 'HTTP版本不受支持'
}

class Request {
  private instance: AxiosInstance
  private pendingRequests: Map<string, AbortController>

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.pendingRequests = new Map()
    this.setupInterceptors()
  }

  // 获取请求的唯一键
  private getRequestKey(config: RequestOptions): string {
    const { method, url, params, data } = config
    return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&')
  }

  // 添加请求到队列
  private addPendingRequest(config: RequestOptions): void {
    const key = this.getRequestKey(config)
    config.__requestKey = key
    const controller = new AbortController()
    config.signal = controller.signal
    this.pendingRequests.set(key, controller)
  }

  // 从队列中移除请求
  private removePendingRequest(config: RequestOptions): void {
    if (config?.__requestKey) {
      this.pendingRequests.delete(config.__requestKey)
    }
  }

  // 取消重复的请求
  private cancelPendingRequest(config: RequestOptions): void {
    const key = this.getRequestKey(config)
    if (this.pendingRequests.has(key)) {
      this.pendingRequests.get(key)?.abort()
      this.pendingRequests.delete(key)
    }
  }

  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const requestConfig = config as RequestOptions
        
        // 取消重复请求
        this.cancelPendingRequest(requestConfig)
        this.addPendingRequest(requestConfig)

        // 添加 token
        if (requestConfig.requiresAuth !== false) {
          const userStore = useUserStore()
          if (userStore.token) {
            config.headers.Authorization = `Bearer ${userStore.token}`
          }
        }

        return config
      },
      (error: AxiosError) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>): Promise<AxiosResponse> => {
        const config = response.config as RequestOptions
        this.removePendingRequest(config)

        if (config.returnRaw) {
          return Promise.resolve(response)
        }

        // 拦截器直接返回业务数据（res.data）而不是 AxiosResponse，
        // 调用方通过 request<T>() 的泛型拿到正确类型

        const res = response.data
        if (res.code !== SUCCESS_CODE) {
          if (!config.noToast) {
            showToast(res.message || '请求失败')
          }
          return Promise.reject(new Error(res.message))
        }

        return Promise.resolve(res.data as unknown as AxiosResponse)
      },
      async (error: unknown) => {
        if (!axios.isAxiosError(error)) {
          return Promise.reject(error)
        }

        const axiosError = error as AxiosError<ApiResponse>
        const config = axiosError.config as RequestOptions
        this.removePendingRequest(config)

        if (axios.isCancel(error)) {
          return Promise.reject(new Error('请求已取消'))
        }

        const errorResponse = axiosError.response

        // 请求重试：仅网络错误或 5xx
        if (config && (!errorResponse || errorResponse.status >= 500)) {
          const idempotent = IDEMPOTENT_METHODS.includes((config.method || 'get').toLowerCase())
          const maxRetry = config.retry ?? (idempotent ? DEFAULT_RETRY : 0)
          const count = config.__retryCount ?? 0

          if (count < maxRetry) {
            config.__retryCount = count + 1
            await sleep(config.retryDelay ?? DEFAULT_RETRY_DELAY)
            return this.instance.request(config)
          }
        }

        const errorData = errorResponse?.data
        const errorMessage = errorData?.message || axiosError.message || '请求失败'

        if (!errorResponse) {
          if (!config?.noToast) {
            showToast('网络连接失败')
          }
          return Promise.reject(new Error(errorMessage))
        }

        const status = errorResponse.status
        if (status === 401) {
          const userStore = useUserStore()
          userStore.resetUserInfo()
          router.push({
            path: '/auth/login',
            query: { redirect: router.currentRoute.value.fullPath }
          })
        }

        if (!config?.noToast) {
          showToast(ERROR_MESSAGES[status] || errorMessage)
        }

        return Promise.reject(new Error(errorMessage))
      }
    )
  }

  // 通用请求方法：返回业务数据 T（响应拦截器已去掉 { code, data, message } 外壳）
  public async request<T = unknown>(config: RequestOptions): Promise<T> {
    // 响应拦截器已经把结果替换为业务数据，这里只需要收窄类型
    const result: unknown = await this.instance.request(config)
    return result as T
  }

  // GET 请求
  public get<T = unknown>(url: string, config?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'get', url })
  }

  // POST 请求
  public post<T = unknown>(url: string, data?: unknown, config?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'post', url, data })
  }

  // PUT 请求
  public put<T = unknown>(url: string, data?: unknown, config?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'put', url, data })
  }

  // DELETE 请求
  public delete<T = unknown>(url: string, config?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'delete', url })
  }

  // 取消所有请求
  public cancelAllRequests(): void {
    this.pendingRequests.forEach(controller => {
      controller.abort()
    })
    this.pendingRequests.clear()
  }
}

export default new Request() 