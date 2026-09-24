import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Enrollment API (backend/main.py on :8425) — Sheets/Gmail/Notion/webhook.
      '/api': { target: 'http://127.0.0.1:8425', changeOrigin: true },
    },
  },
  build: {
    target: 'es2017',
    // No sourcemaps in the deployed bundle
    sourcemap: false,
  },
})
