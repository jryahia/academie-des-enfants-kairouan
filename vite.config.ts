import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { logoDataUri } from './src/brand/logo'

// Injects the origami-star logo as a base64 SVG favicon. The mark is built
// from the same geometry as the React <LogoMark />, so tab icon and on-page
// logo can never drift apart.
function brandFavicon(): Plugin {
  return {
    name: 'brand-favicon',
    transformIndexHtml() {
      const href = logoDataUri()
      return [
        { tag: 'link', attrs: { rel: 'icon', type: 'image/svg+xml', href }, injectTo: 'head' },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href }, injectTo: 'head' },
      ]
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  // Public path. '/' for Cloudflare Pages / local. GitHub Pages project sites
  // are served from '/<repo-name>/': set it here before `npm run deploy`.
  // Photo URLs read import.meta.env.BASE_URL, so nothing else needs editing.
  base: '/',
  plugins: [react(), brandFavicon()],
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
