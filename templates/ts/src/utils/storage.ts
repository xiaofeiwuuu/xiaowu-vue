import type { StorageOptions } from '@/types/utils'

interface StorageData<T = unknown> {
  value: T
  expire?: number
}

class Storage {
  private prefix: string
  private storage: globalThis.Storage

  constructor(options: StorageOptions = {}) {
    this.prefix = options.prefix || 'app_'
    this.storage = window.localStorage
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  set<T>(key: string, value: T, expire?: number): void {
    const data: StorageData<T> = {
      value,
      expire: expire ? new Date().getTime() + expire * 1000 : 0
    }
    this.storage.setItem(this.getKey(key), JSON.stringify(data))
  }

  get<T>(key: string): T | null {
    const item = this.storage.getItem(this.getKey(key))
    if (!item) return null

    try {
      const data: StorageData<T> = JSON.parse(item)
      
      if (data.expire && data.expire < new Date().getTime()) {
        this.remove(key)
        return null
      }
      
      return data.value
    } catch {
      return null
    }
  }

  remove(key: string): void {
    this.storage.removeItem(this.getKey(key))
  }

  clear(includePrefix = true): void {
    if (includePrefix) {
      Object.keys(this.storage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          this.storage.removeItem(key)
        }
      })
    } else {
      this.storage.clear()
    }
  }

  has(key: string): boolean {
    return !!this.get(key)
  }
}

export const storage = new Storage()
export const sessionStorage = new Storage({ prefix: 'session_' }) 