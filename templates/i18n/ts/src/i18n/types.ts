export interface Messages {
  common: {
    confirm: string
    cancel: string
    save: string
    delete: string
  }
  auth: {
    login: string
    register: string
    logout: string
  }
}

export type Language = 'zh' | 'en'
