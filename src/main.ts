import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'
import { MotionPlugin } from '@vueuse/motion'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import Aura from '@primeuix/themes/aura'
import Toast from 'primevue/toast'

const app = createApp(App)

app.use(router)
app.use(VCalendar, {})
app.use(MotionPlugin)
app.use(createPinia())
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.component('PrimeToast', Toast)
app.use(ToastService)
app.mount('#app')
