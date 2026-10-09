import type { UserInfo } from '@/types/api'

export interface UserState {
  userInfo: UserInfo | null
  token: string | null
}

export interface AppState {
  darkMode: boolean
  language: string
  deviceType: 'mobile' | 'desktop'
  loading: boolean
}

export interface TabState {
  activeTab: string
  tabs: Array<{
    name: string
    title: string
    path: string
  }>
} 