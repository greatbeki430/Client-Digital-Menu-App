import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { initAuthSync } from '@/utils/authSync'

// Initialize authentication sync BEFORE creating the app
console.log('🚀 Starting application initialization...')
initAuthSync()

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

console.log('✅ Application mounted successfully')
