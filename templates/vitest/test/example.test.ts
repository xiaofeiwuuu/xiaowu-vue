import { describe, it, expect } from 'vitest'
import { encrypt, base64Encode, base64Decode } from '@/utils/crypto'

describe('crypto', () => {
  it('encrypt 返回 MD5', () => {
    expect(encrypt('123456')).toBe('e10adc3949ba59abbe56e057f20f883e')
  })

  it('encrypt 空字符串返回空', () => {
    expect(encrypt('')).toBe('')
  })

  it('base64 编码后可还原（含中文）', () => {
    expect(base64Decode(base64Encode('你好 Hello'))).toBe('你好 Hello')
  })
})
