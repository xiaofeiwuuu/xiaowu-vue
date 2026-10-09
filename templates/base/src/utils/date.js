/**
 * 格式化日期
 * @param {Date | string | number} date
 * @param {{ format?: string }} [options]
 * @returns {string}
 */
export function formatDate(date, options = {}) {
  const d = new Date(date)
  const { format = 'YYYY-MM-DD HH:mm:ss' } = options

  const formatMap = {
    YYYY: d.getFullYear(),
    MM: d.getMonth() + 1,
    DD: d.getDate(),
    HH: d.getHours(),
    mm: d.getMinutes(),
    ss: d.getSeconds()
  }

  return format.replace(/(YYYY|MM|DD|HH|mm|ss)/g, (match) => {
    const value = formatMap[match]
    return value < 10 ? `0${value}` : String(value)
  })
}

/**
 * 格式化相对时间
 * @param {Date | string | number} date
 * @returns {string}
 */
export function formatRelativeTime(date) {
  const diff = Date.now() - new Date(date).getTime()

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * day

  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)}分钟前`
  if (diff < day) return `${Math.floor(diff / hour)}小时前`
  if (diff < week) return `${Math.floor(diff / day)}天前`
  if (diff < month) return `${Math.floor(diff / week)}周前`
  if (diff < year) return `${Math.floor(diff / month)}个月前`
  return formatDate(date, { format: 'YYYY-MM-DD' })
}

/**
 * 判断是否是今天
 * @param {Date | string | number} date
 * @returns {boolean}
 */
export function isToday(date) {
  const today = new Date()
  const target = new Date(date)
  return (
    today.getFullYear() === target.getFullYear() &&
    today.getMonth() === target.getMonth() &&
    today.getDate() === target.getDate()
  )
}

/**
 * 添加天数
 * @param {Date} date
 * @param {number} days
 * @returns {Date}
 */
export function addDays(date, days) {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/**
 * 获取星期几
 * @param {Date | string | number} date
 * @returns {string}
 */
export function getWeekDay(date) {
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekDays[new Date(date).getDay()]
}
