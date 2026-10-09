import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
// @i18n-import

import 'amfe-flexible'
import 'vant/lib/index.css'
import './assets/styles/index.scss'
import './assets/styles/vant.scss'
import './utils/rem'

const app = createApp(App)

app.use(createPinia())
app.use(router)
// @i18n-use

app.mount('#app')