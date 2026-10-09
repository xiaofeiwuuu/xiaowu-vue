<template>
  <van-dropdown-menu>
    <van-dropdown-item v-model="currentLang" :options="options" @change="handleChange" />
  </van-dropdown-menu>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLang = ref(locale.value)

const options = [
  { text: '中文', value: 'zh' },
  { text: 'English', value: 'en' }
]

const handleChange = (value) => {
  locale.value = value
  localStorage.setItem('language', value)
}
</script>
