import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'
import { MotionPlugin } from '@vueuse/motion'
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(router)
app.use(VCalendar, {})
app.use(MotionPlugin)
app.use(createPinia())
app.mount('#app')
