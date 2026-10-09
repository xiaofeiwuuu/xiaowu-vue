import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
// @i18n-import

// 函数式组件（showToast / showDialog / showNotify）不会被按需引入样式，需要手动引入；
// 模板里的 <van-xxx> 组件样式由 VantResolver 自动按需引入。用到其他函数式组件时在此补充
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'
import './assets/styles/index.scss'
import './assets/styles/vant.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
// @i18n-use
app.mount('#app') 