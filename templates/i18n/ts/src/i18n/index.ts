import { createI18n } from 'vue-i18n'
import type { Messages, Language } from './types'
import zh from './locales/zh.json'
import en from './locales/en.json'

const i18n = createI18n<[Messages], Language>({
  legacy: false,
  locale: (localStorage.getItem('language') as Language) || 'zh',
  fallbackLocale: 'zh',
  messages: {
    zh,
    en
  }
})

export default i18n
