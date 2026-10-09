import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { setActivePinia, createPinia } from 'pinia'

vi.mock('@/router', () => ({ default: { push: vi.fn(), currentRoute: { value: { fullPath: '/' } } } }))
vi.mock('vant', () => ({ showToast: vi.fn(), showDialog: vi.fn(() => Promise.resolve()) }))

import request from '@/utils/request'

// JS 版导出 axios 实例；TS 版导出封装类，内部实例为 instance
const instance = (Reflect.get(request, 'instance') ?? request) as AxiosInstance

let calls = 0

// 用假 adapter 模拟后端，不发真实网络请求
function mockServer(handler: (config: InternalAxiosRequestConfig) => { status: number; body?: unknown }) {
  instance.defaults.adapter = (config) =>
    new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        calls++
        const { status, body } = handler(config)
        const response = {
          data: body ?? { code: 200, data: 'ok', message: '' },
          status,
          statusText: '',
          headers: {},
          config
        } as AxiosResponse
        if (status >= 400) {
          reject(new axios.AxiosError('fail', 'ERR_BAD_RESPONSE', config, null, response))
        } else {
          resolve(response)
        }
      }, 10)
      config.signal?.addEventListener('abort', () => {
        clearTimeout(timer)
        reject(new axios.CanceledError('canceled', config))
      })
    })
}

beforeEach(() => {
  calls = 0
  setActivePinia(createPinia())
})

describe('request', () => {
  it('业务成功码 200 时返回业务数据', async () => {
    mockServer(() => ({ status: 200 }))
    await expect(request.get('/a')).resolves.toBe('ok')
  })

  it('同一接口、不同参数的并发请求互不取消', async () => {
    mockServer(() => ({ status: 200 }))
    const results = await Promise.all([
      request.get('/list', { params: { page: 1 } }),
      request.get('/list', { params: { page: 2 } })
    ])
    expect(results).toEqual(['ok', 'ok'])
    expect(calls).toBe(2)
  })

  it('完全相同的请求：前一个被取消，且被取消的请求不会重试', async () => {
    mockServer(() => ({ status: 200 }))
    const first = request.get('/same', { noToast: true })
    const second = request.get('/same', { noToast: true })
    await expect(first).rejects.toBeTruthy()
    await expect(second).resolves.toBe('ok')
    expect(calls).toBe(1)
  })

  it('GET 遇到 500 默认重试 3 次（共 4 次）', async () => {
    mockServer(() => ({ status: 500, body: {} }))
    await expect(request.get('/err', { noToast: true, retryDelay: 1 })).rejects.toBeTruthy()
    expect(calls).toBe(4)
  })

  it('POST 遇到 500 默认不重试，避免重复提交', async () => {
    mockServer(() => ({ status: 500, body: {} }))
    await expect(request.post('/err', { a: 1 }, { noToast: true, retryDelay: 1 })).rejects.toBeTruthy()
    expect(calls).toBe(1)
  })

  it('POST 显式设置 retry: 1 时重试 1 次（共 2 次）', async () => {
    mockServer(() => ({ status: 500, body: {} }))
    await expect(
      request.post('/err2', { a: 1 }, { noToast: true, retry: 1, retryDelay: 1 })
    ).rejects.toBeTruthy()
    expect(calls).toBe(2)
  })

  it('4xx 不重试', async () => {
    mockServer(() => ({ status: 404, body: {} }))
    await expect(request.get('/nf', { noToast: true, retryDelay: 1 })).rejects.toBeTruthy()
    expect(calls).toBe(1)
  })
})
