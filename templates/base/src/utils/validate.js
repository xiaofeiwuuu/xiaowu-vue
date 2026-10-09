/** 验证邮箱 */
export function isEmail(value) {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)
}

/** 验证手机号 */
export function isPhone(value) {
  return /^1[3-9]\d{9}$/.test(value)
}

/** 验证 URL */
export function isURL(value) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

/** 验证身份证 */
export function isIdCard(value) {
  return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
}

/** 验证邮政编码 */
export function isPostalCode(value) {
  return /^[1-9]\d{5}$/.test(value)
}

/** 验证银行卡 */
export function isBankCard(value) {
  return /^([1-9]{1})(\d{15}|\d{18})$/.test(value)
}

/** 验证 IPv4 */
export function isIPv4(value) {
  if (!/^(\d{1,3}\.){3}\d{1,3}$/.test(value)) return false
  return value.split('.').every((part) => {
    const num = parseInt(part, 10)
    return num >= 0 && num <= 255
  })
}

/** 验证强密码：至少 8 位，包含大小写字母、数字和特殊字符 */
export function isStrongPassword(value) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(value)
}

/** 验证安全字符串：不含特殊字符和 SQL 关键字 */
export function isSafeString(value) {
  const sqlKeywords = ['select', 'update', 'delete', 'insert', 'drop', 'union']
  return (
    /^[^<>'";\\/]*$/.test(value) &&
    !sqlKeywords.some((keyword) => value.toLowerCase().includes(keyword))
  )
}
