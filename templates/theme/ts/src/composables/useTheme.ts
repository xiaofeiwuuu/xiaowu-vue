import { computed, ref, watch } from 'vue'

export type ThemeMode = 'light' | 'dark'

// 本地存储的 key：'light' | 'dark'；未设置时跟随系统。index.html 里的首屏脚本读取同一个 key
const STORAGE_KEY = 'theme'

function readStored(): ThemeMode | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

const media = window.matchMedia('(prefers-color-scheme: dark)')
const mode = ref<ThemeMode | null>(readStored())
const systemDark = ref(media.matches)
media.addEventListener('change', (e) => {
  systemDark.value = e.matches
})

const isDark = computed(() => (mode.value ? mode.value === 'dark' : systemDark.value))

function apply(dark: boolean): void {
  const root = document.documentElement
  // Vant 通过 .van-theme-dark 切换整套 CSS 变量
  root.classList.toggle('van-theme-dark', dark)
  root.style.colorScheme = dark ? 'dark' : 'light'
}

/** 应用启动时调用一次，之后主题变化会自动同步到 <html> */
export function initTheme(): void {
  watch(isDark, apply, { immediate: true })
}

/**
 * 主题控制
 * - isDark：当前是否为暗黑模式
 * - mode：用户显式选择的主题，null 表示跟随系统
 * - setTheme('light' | 'dark' | null)：设置主题，null 恢复为跟随系统
 */
export function useTheme() {
  const setTheme = (value: ThemeMode | null): void => {
    mode.value = value
    try {
      if (value) localStorage.setItem(STORAGE_KEY, value)
      else localStorage.removeItem(STORAGE_KEY)
    } catch {
      // 隐私模式等场景下无法写入，仅本次会话生效
    }
  }

  const toggleTheme = (): void => setTheme(isDark.value ? 'light' : 'dark')

  return { isDark, mode, setTheme, toggleTheme }
}
