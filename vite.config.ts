import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Set Edge as the default browser for Vite
process.env.BROWSER = 'msedge'

export default defineConfig({
  // 🔗 Necesario para GitHub Pages (nombre exacto del repo)
  base: '/',

  plugins: [react()],

  // 🏗️ Output compatible con GitHub Pages (/docs)
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },

  // ⚙️ Configuración SOLO para desarrollo local
  server: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})