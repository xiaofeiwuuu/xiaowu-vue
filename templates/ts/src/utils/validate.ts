// 验证邮箱
export function isEmail(value: string): boolean {
  const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  return regex.test(value)
}

// 验证手机号
export function isPhone(value: string): boolean {
  const regex = /^1[3-9]\d{9}$/
  return regex.test(value)
}

// 验证URL
export function isURL(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

// 验证身份证
export function isIdCard(value: string): boolean {
  const regex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return regex.test(value)
}

// 验证邮政编码
export function isPostalCode(value: string): boolean {
  const regex = /^[1-9]\d{5}$/
  return regex.test(value)
}

// 验证银行卡
export function isBankCard(value: string): boolean {
  const regex = /^([1-9]{1})(\d{15}|\d{18})$/
  return regex.test(value)
}

// 验证IPv4
export function isIPv4(value: string): boolean {
  const regex = /^(\d{1,3}\.){3}\d{1,3}$/
  if (!regex.test(value)) return false
  
  const parts = value.split('.')
  return parts.every(part => {
    const num = parseInt(part, 10)
    return num >= 0 && num <= 255
  })
}

// 验证强密码
export function isStrongPassword(value: string): boolean {
  // 至少8位，包含大小写字母、数字和特殊字符
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
  return regex.test(value)
}

// 验证安全字符串
export function isSafeString(value: string): boolean {
  // 不包含特殊字符和SQL注入关键字
  const regex = /^[^<>'";\\/]*$/
  const sqlKeywords = ['select', 'update', 'delete', 'insert', 'drop', 'union']
  return regex.test(value) && !sqlKeywords.some(keyword => 
    value.toLowerCase().includes(keyword)
  )
} 