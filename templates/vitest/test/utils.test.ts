import { describe, it, expect, vi } from 'vitest'
import { debounce, deepClone, chunk, formatFileSize } from '@/utils/common'
import { formatDate, addDays } from '@/utils/date'
import { isEmail, isPhone, isIPv4 } from '@/utils/validate'

describe('common', () => {
  it('debounce 只执行最后一次', () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debounced = debounce(fn, 100)
    debounced(1)
    debounced(2)
    vi.advanceTimersByTime(100)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(2)
    vi.useRealTimers()
  })

  it('deepClone 得到独立副本', () => {
    const source = { a: { b: [1, 2] }, d: new Date(0) }
    const cloned = deepClone(source)
    expect(cloned).toEqual(source)
    expect(cloned.a).not.toBe(source.a)
    expect(cloned.d).not.toBe(source.d)
  })

  it('chunk 与 formatFileSize', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
    expect(formatFileSize(1536)).toBe('1.5 KB')
  })
})

describe('date', () => {
  it('formatDate 补零', () => {
    expect(formatDate(new Date(2024, 0, 5, 3, 4, 5))).toBe('2024-01-05 03:04:05')
  })

  it('addDays 不修改原日期', () => {
    const d = new Date(2024, 0, 31)
    expect(addDays(d, 1).getMonth()).toBe(1)
    expect(d.getMonth()).toBe(0)
  })
})

describe('validate', () => {
  it('isEmail / isPhone / isIPv4', () => {
    expect(isEmail('a@b.com')).toBe(true)
    expect(isEmail('a@b')).toBe(false)
    expect(isPhone('13800138000')).toBe(true)
    expect(isPhone('12345678901')).toBe(false)
    expect(isIPv4('192.168.1.1')).toBe(true)
    expect(isIPv4('256.1.1.1')).toBe(false)
  })
})
