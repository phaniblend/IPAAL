import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { vitePluginLocalReview } from './vite-plugin-local-review.js'

// https://vite.dev/config/
// AI server port must match where you run npm run server (default 3000; use PORT=3001 then set VITE_AI_SERVER_PORT=3001)
const aiServerPort = process.env.VITE_AI_SERVER_PORT || process.env.PORT || 3000

export default defineConfig({
  plugins: [react(), vitePluginLocalReview()],
  resolve: {
    // One React instance for the whole app (avoids "Invalid hook call" / useRef on null in HashRouter).
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router', 'react-router-dom'],
  },
  server: {
    proxy: {
      '/api': { target: `http://localhost:${aiServerPort}`, changeOrigin: true },
    },
  },
})
