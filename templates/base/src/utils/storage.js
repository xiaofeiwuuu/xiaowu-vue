/**
 * localStorage 操作封装
 */
export const localStorage = {
  /**
   * 设置 localStorage
   * @param {string} key 键
   * @param {any} value 值
   * @param {number} expire 过期时间（秒），0 表示不过期
   */
  set(key, value, expire = 0) {
    const data = {
      value,
      expire: expire ? Date.now() + expire * 1000 : 0
    }
    window.localStorage.setItem(key, JSON.stringify(data))
  },

  /**
   * 获取 localStorage
   * @param {string} key 键
   * @returns {any} 值
   */
  get(key) {
    const json = window.localStorage.getItem(key)
    if (!json) return null

    const data = JSON.parse(json)
    // 判断是否过期
    if (data.expire && data.expire < Date.now()) {
      this.remove(key)
      return null
    }
    return data.value
  },

  /**
   * 删除 localStorage
   * @param {string} key 键
   */
  remove(key) {
    window.localStorage.removeItem(key)
  },

  /**
   * 清空 localStorage
   */
  clear() {
    window.localStorage.clear()
  }
} 