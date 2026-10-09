/**
 * 防抖
 * @param {Function} fn 需要防抖的函数
 * @param {number} delay 延迟毫秒数
 * @returns {Function}
 */
export function debounce(fn, delay) {
  let timer = null

  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * 节流
 * @param {Function} fn 需要节流的函数
 * @param {number} delay 间隔毫秒数
 * @returns {Function}
 */
export function throttle(fn, delay) {
  let last = 0

  return function (...args) {
    const now = Date.now()
    if (now - last >= delay) {
      fn.apply(this, args)
      last = now
    }
  }
}

/**
 * 深拷贝
 * @template T
 * @param {T} obj
 * @returns {T}
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime())
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj)
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item))
  }

  const cloned = {}
  for (const [key, value] of Object.entries(obj)) {
    cloned[key] = deepClone(value)
  }
  return cloned
}

/**
 * 格式化文件大小
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * 生成 UUID
 * @returns {string}
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 睡眠
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * 数组分块
 * @template T
 * @param {T[]} array
 * @param {number} size
 * @returns {T[][]}
 */
export function chunk(array, size) {
  const result = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}

/**
 * 随机整数（包含 min 和 max）
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
