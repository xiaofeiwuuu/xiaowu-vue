export interface Language {
  name: string
  locale: string
  flag?: string
}

export interface LocaleMessages {
  [key: string]: string | LocaleMessages
}

export interface I18nOptions {
  locale: string
  fallbackLocale: string
  messages: Record<string, LocaleMessages>
}

// 定义所有支持的语言
export const SUPPORTED_LANGUAGES: Language[] = [
  { name: '简体中文', locale: 'zh-CN', flag: '🇨🇳' },
  { name: 'English', locale: 'en-US', flag: '🇺🇸' }
]

// 默认语言
export const DEFAULT_LANGUAGE = 'zh-CN' 