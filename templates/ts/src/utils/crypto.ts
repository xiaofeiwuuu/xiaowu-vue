import md5 from 'md5'

/**
 * 注意：这里的加密/编码只用于缓存混淆、签名等非安全场景。
 * 前端代码和 .env 变量对用户完全可见，所以不要用它保护密码：
 * 登录、注册请通过 HTTPS 传输，由服务端使用 bcrypt / argon2 等算法存储。
 */

/**
 * MD5 加密（不可逆）
 * @param str 需要加密的字符串
 * @param isUpperCase 是否转换成大写
 * @returns 加密后的字符串
 */
export function encrypt(str: string, isUpperCase: boolean = false): string {
  if (!str) return ''
  const hash = md5(str)
  return isUpperCase ? hash.toUpperCase() : hash
}

/**
 * 带盐的 MD5 加密（不可逆）
 * @param str 需要加密的字符串
 * @param key 加密密钥
 * @returns 加密后的字符串
 */
export function encryptWithSalt(str: string, key: string): string {
  if (!str || !key) return ''
  const salt = md5(key).substring(0, 16)
  return md5(str + salt)
}

/**
 * Base64 编码
 * @param str 需要编码的字符串
 * @returns 编码后的字符串
 */
export function base64Encode(str: string): string {
  try {
    if (!str) return ''
    // 使用 encodeURIComponent 处理中文
    return btoa(encodeURIComponent(str))
  } catch (error) {
    console.error('Base64 编码失败:', error)
    return ''
  }
}

/**
 * Base64 解码
 * @param str 需要解码的字符串
 * @returns 解码后的字符串
 */
export function base64Decode(str: string): string {
  try {
    if (!str) return ''
    // 使用 decodeURIComponent 处理中文
    return decodeURIComponent(atob(str))
  } catch (error) {
    console.error('Base64 解码失败:', error)
    return ''
  }
}
