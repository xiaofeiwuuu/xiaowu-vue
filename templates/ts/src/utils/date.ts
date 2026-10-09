import type { TimeFormatOptions } from '@/types/utils'

// 格式化日期
export function formatDate(date: Date | string | number, options: TimeFormatOptions = {}): string {
  const d = new Date(date)
  const { format = 'YYYY-MM-DD HH:mm:ss' } = options

  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hour = d.getHours()
  const minute = d.getMinutes()
  const second = d.getSeconds()

  const formatMap: Record<string, number> = {
    YYYY: year,
    MM: month,
    DD: day,
    HH: hour,
    mm: minute,
    ss: second
  }

  return format.replace(/(YYYY|MM|DD|HH|mm|ss)/g, (match) => {
    const value = formatMap[match]
    return value < 10 ? `0${value}` : String(value)
  })
}

// 格式化相对时间
export function formatRelativeTime(date: Date | string | number): string {
  const now = new Date().getTime()
  const target = new Date(date).getTime()
  const diff = now - target

  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * day

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return `${Math.floor(diff / minute)}分钟前`
  } else if (diff < day) {
    return `${Math.floor(diff / hour)}小时前`
  } else if (diff < week) {
    return `${Math.floor(diff / day)}天前`
  } else if (diff < month) {
    return `${Math.floor(diff / week)}周前`
  } else if (diff < year) {
    return `${Math.floor(diff / month)}个月前`
  } else {
    return formatDate(date, { format: 'YYYY-MM-DD' })
  }
}

// 判断是否是今天
export function isToday(date: Date | string | number): boolean {
  const today = new Date()
  const target = new Date(date)
  return (
    today.getFullYear() === target.getFullYear() &&
    today.getMonth() === target.getMonth() &&
    today.getDate() === target.getDate()
  )
}

// 添加天数
export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// 获取星期几
export function getWeekDay(date: Date | string | number): string {
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return weekDays[new Date(date).getDay()]
} 