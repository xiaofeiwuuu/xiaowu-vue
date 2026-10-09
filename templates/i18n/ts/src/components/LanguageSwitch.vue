<template>
  <van-dropdown-menu>
    <van-dropdown-item v-model="currentLang" :options="options" @change="handleChange" />
  </van-dropdown-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Language } from '../i18n/types'

const { locale } = useI18n()
const currentLang = ref<Language>(locale.value as Language)

interface Option {
  text: string
  value: Language
}

const options: Option[] = [
  { text: '中文', value: 'zh' },
  { text: 'English', value: 'en' }
]

const handleChange = (value: Language): void => {
  locale.value = value
  localStorage.setItem('language', value)
}
</script>
