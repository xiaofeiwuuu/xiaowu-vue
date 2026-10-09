import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick } from 'vue'

// useTheme 在模块加载时读取 matchMedia 和 localStorage，所以每个用例都要重新导入模块
async function loadTheme(systemDark: boolean) {
  vi.resetModules()
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: systemDark,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn()
  }))
  const mod = await import('@/composables/useTheme')
  mod.initTheme()
  await nextTick()
  return mod
}

const root = document.documentElement

beforeEach(() => {
  localStorage.clear()
  root.classList.remove('van-theme-dark')
  root.style.colorScheme = ''
})

describe('useTheme', () => {
  it('未手动设置时跟随系统：系统为深色', async () => {
    const { useTheme } = await loadTheme(true)
    expect(useTheme().isDark.value).toBe(true)
    expect(root.classList.contains('van-theme-dark')).toBe(true)
  })

  it('未手动设置时跟随系统：系统为浅色', async () => {
    const { useTheme } = await loadTheme(false)
    expect(useTheme().isDark.value).toBe(false)
    expect(root.classList.contains('van-theme-dark')).toBe(false)
  })

  it('手动设置优先于系统，并写入本地存储', async () => {
    const { useTheme } = await loadTheme(true)
    const { setTheme, isDark } = useTheme()

    setTheme('light')
    await nextTick()
    expect(isDark.value).toBe(false)
    expect(root.classList.contains('van-theme-dark')).toBe(false)
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('setTheme(null) 清除选择并恢复跟随系统', async () => {
    const { useTheme } = await loadTheme(true)
    const { setTheme, isDark, mode } = useTheme()

    setTheme('light')
    setTheme(null)
    await nextTick()
    expect(mode.value).toBeNull()
    expect(isDark.value).toBe(true)
    expect(localStorage.getItem('theme')).toBeNull()
  })

  it('启动时读取已保存的主题', async () => {
    localStorage.setItem('theme', 'dark')
    const { useTheme } = await loadTheme(false)
    expect(useTheme().isDark.value).toBe(true)
    expect(root.classList.contains('van-theme-dark')).toBe(true)
  })

  it('toggleTheme 在深浅之间切换', async () => {
    const { useTheme } = await loadTheme(false)
    const { toggleTheme, isDark } = useTheme()

    toggleTheme()
    expect(isDark.value).toBe(true)
    toggleTheme()
    expect(isDark.value).toBe(false)
  })
})
