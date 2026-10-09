import md5 from 'md5'

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
