import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify } from 'quasar'

import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import '@/styles/global.scss'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
  plugins: {
    Notify,
  },
  config: {
    brand: {
      primary: '#1E3A8A',
      secondary: '#10B981',
      accent: '#3B82F6',
      dark: '#0c365a',
      positive: '#10B981',
      negative: '#EF4444',
      info: '#3B82F6',
      warning: '#F59E0B',
    },
    notify: {
      position: 'top',
      timeout: 3000,
      textColor: 'white',
      actions: [{ icon: 'close', color: 'white' }],
    },
  },
})

app.mount('#app')
