import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// AI server port must match where you run npm run server (default 3000; use PORT=3001 then set VITE_AI_SERVER_PORT=3001)
const aiServerPort = process.env.VITE_AI_SERVER_PORT || process.env.PORT || 3000

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: `http://localhost:${aiServerPort}`, changeOrigin: true },
    },
  },
})
