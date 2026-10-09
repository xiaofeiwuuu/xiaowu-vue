import { defineStore } from 'pinia'

interface MainState {
  count: number
}

export const useMainStore = defineStore('main', {
  state: (): MainState => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  }
}) 