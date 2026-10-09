import axios from 'axios';
import { showToast, showDialog } from 'vant';
import router from '@/router';
import { clearAuth, getToken } from '@/utils/auth';

// 配置
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
};

// 业务成功状态码
const SUCCESS_CODE = 200;

// 创建 axios 实例
const request = axios.create(API_CONFIG);

// 存储未完成的请求
const pendingRequests = new Map();

// 生成唯一请求标识
function generateRequestKey(config) {
  return `${config.url}&${config.method}`;
}

// 请求拦截器
request.interceptors.request.use((config) => {
  // 添加 token
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 生成唯一标识
  const requestKey = generateRequestKey(config);

  // 如果存在相同接口的未完成请求，则取消
  if (pendingRequests.has(requestKey)) {
    const previousSource = pendingRequests.get(requestKey);
    previousSource.cancel(`取消重复请求: ${requestKey}`);
    pendingRequests.delete(requestKey);
  }

  // 添加请求取消逻辑
  const source = axios.CancelToken.source();
  config.cancelToken = source.token;
  pendingRequests.set(requestKey, source);

  return config;
});

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // 请求完成后移除
    const requestKey = generateRequestKey(response.config);
    pendingRequests.delete(requestKey);

    // 统一处理业务状态码
    const { code, message, data } = response.data;

    if (code === SUCCESS_CODE) {
      return data; // 返回实际数据
    } else {
      // 抛出错误，进入 catch 分支
      throw new Error(message || '请求失败');
    }
  },
  async (error) => {
    // 请求完成后移除
    if (error.config) {
      const requestKey = generateRequestKey(error.config);
      pendingRequests.delete(requestKey);
    }

    // 登录过期处理（HTTP 状态码为 401）
    if (error.response?.status === 401) {
      clearAuth();

      await showDialog({
        title: '提示',
        message: '登录已过期，请重新登录',
        confirmButtonText: '确定',
        showCancelButton: false,
      });

      router.push('/auth/login');
      return Promise.reject(new Error('登录已过期'));
    }

    // 请求重试逻辑
    const MAX_RETRY_COUNT = 3;
    const RETRY_DELAY = 1000; // 重试延迟 1 秒
    const config = error.config;

    if (
      !error.response ||
      error.response.status >= 500
    ) {
      if (!config.__retryCount) {
        config.__retryCount = 0;
      }

      if (config.__retryCount < MAX_RETRY_COUNT) {
        config.__retryCount++;

        // 添加重试延迟
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));

        return request(config);
      }
    }

    // 统一错误提示
    if (!error.config?.noToast) {
      const errorMessage = error.message || error.response?.data?.message || '请求失败';
      showToast(errorMessage);
    }

    return Promise.reject(error);
  }
);

// 取消所有未完成的请求
export function cancelAllRequests() {
  pendingRequests.forEach((source, requestKey) => {
    source.cancel(`取消请求: ${requestKey}`);
  });
  pendingRequests.clear();
}

export default request;