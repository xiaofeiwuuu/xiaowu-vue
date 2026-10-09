import axios from 'axios'
import { showToast, showDialog } from 'vant'
import router from '@/router'
import { clearAuth, getToken } from '@/utils/auth'

// 业务成功状态码
const SUCCESS_CODE = 200

// 重试默认值：仅幂等请求（GET / HEAD / OPTIONS）默认重试，避免 POST 等重复提交
const DEFAULT_RETRY = 3
const DEFAULT_RETRY_DELAY = 1000
const IDEMPOTENT_METHODS = ['get', 'head', 'options']

// 配置
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000
}

/**
 * 请求扩展配置（作为 axios 第三个参数传入）
 * @typedef {object} RequestOptions
 * @property {boolean} [noToast] 是否禁用错误提示
 * @property {number} [retry] 失败重试次数，0 表示不重试
 * @property {number} [retryDelay] 重试间隔（毫秒）
 */

// 创建 axios 实例
const request = axios.create(API_CONFIG)

// 存储未完成的请求：key -> AbortController
const pendingRequests = new Map()

// 生成唯一请求标识：包含参数，避免同一接口不同参数的并发请求互相取消
function generateRequestKey(config) {
  return [config.method, config.url, JSON.stringify(config.params), JSON.stringify(config.data)].join('&')
}

// 请求完成后移除（key 在请求拦截器中保存到 config，避免响应阶段 data 已被序列化导致 key 不一致）
function removePending(config) {
  if (config?.__requestKey) pendingRequests.delete(config.__requestKey)
}

// 请求拦截器
request.interceptors.request.use((config) => {
  // 添加 token
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  const requestKey = generateRequestKey(config)
  config.__requestKey = requestKey

  // 如果存在完全相同的未完成请求，则取消
  pendingRequests.get(requestKey)?.abort()

  const controller = new AbortController()
  config.signal = controller.signal
  pendingRequests.set(requestKey, controller)

  return config
})

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    removePending(response.config)

    // 统一处理业务状态码
    const { code, message, data } = response.data

    if (code === SUCCESS_CODE) {
      return data // 返回实际数据
    }
    // 抛出错误，进入 catch 分支
    throw new Error(message || '请求失败')
  },
  async (error) => {
    // 主动取消（如重复请求）不提示也不重试
    if (axios.isCancel(error)) {
      return Promise.reject(error)
    }

    const config = error.config
    removePending(config)

    // 登录过期处理（HTTP 状态码为 401）
    if (error.response?.status === 401) {
      clearAuth()

      await showDialog({
        title: '提示',
        message: '登录已过期，请重新登录',
        confirmButtonText: '确定',
        showCancelButton: false
      })

      router.push('/auth/login')
      return Promise.reject(new Error('登录已过期'))
    }

    // 请求重试：仅网络错误或 5xx
    if (config && (!error.response || error.response.status >= 500)) {
      const idempotent = IDEMPOTENT_METHODS.includes((config.method || 'get').toLowerCase())
      const maxRetry = config.retry ?? (idempotent ? DEFAULT_RETRY : 0)
      const count = config.__retryCount ?? 0

      if (count < maxRetry) {
        config.__retryCount = count + 1
        await new Promise((resolve) => setTimeout(resolve, config.retryDelay ?? DEFAULT_RETRY_DELAY))
        return request(config)
      }
    }

    // 统一错误提示
    if (!config?.noToast) {
      const errorMessage = error.message || error.response?.data?.message || '请求失败'
      showToast(errorMessage)
    }

    return Promise.reject(error)
  }
)

// 取消所有未完成的请求
export function cancelAllRequests() {
  pendingRequests.forEach((controller) => controller.abort())
  pendingRequests.clear()
}

export default request
