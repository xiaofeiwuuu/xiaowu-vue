import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
// @i18n-import
import 'amfe-flexible'

// 引入 Vant 样式
import 'vant/lib/index.css'
import './assets/styles/index.scss'
import './assets/styles/vant.scss'
import './utils/rem'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
// @i18n-use
app.mount('#app') 