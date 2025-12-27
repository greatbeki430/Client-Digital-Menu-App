import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // ADD THIS SERVER CONFIGURATION
  server: {
    proxy: {
      '/api': {
        target: 'https://laravelapi.mebrejderma.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
        // Optional: Add headers if needed
        headers: {
          Origin: 'https://vuefront.mebrejderma.com',
        },
      },
    },
  },
})
