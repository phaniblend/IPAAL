import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import { vitePluginLocalReview } from './vite-plugin-local-review.js'

// vite.config.js runs before Vite's own env loading applies to process.env,
// so load .env here explicitly (same pattern as server/index.js).
dotenv.config()

// https://vite.dev/config/
// AI server port must match where you run npm run server (default 3000; if you change it, set
// VITE_AI_SERVER_PORT to match — NOT plain PORT, which is ambiguous with whatever launches Vite
// itself. A dev-server launcher setting PORT=5173 for its own bookkeeping would otherwise make
// this proxy target itself (silent self-loop, dressed up as random ECONNREFUSED/ENOBUFS noise).
const aiServerPort = process.env.VITE_AI_SERVER_PORT || 3000

// IPF: OneDev backend (invisible plumbing behind PD Studio / Workbench).
// Auth stays server-side here — never shipped to the browser bundle.
const onedevUser = process.env.ONEDEV_API_USER || 'inpact-admin'
const onedevPass = process.env.ONEDEV_API_PASS || ''
const onedevAuth = 'Basic ' + Buffer.from(`${onedevUser}:${onedevPass}`).toString('base64')

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
    // Found live 2026-08-09: with no `host` set, Vite's dev server ended up bound only to
    // [::1]:5173 (IPv6 loopback) in this environment — "localhost:5173" worked (resolved to ::1),
    // but "127.0.0.1:5173" got ERR_CONNECTION_REFUSED, which broke the Google OAuth redirect target
    // (IPF_FRONTEND_URL) AND anyone who just happens to browse via the literal IPv4 address, as the
    // founder does here. `host: true` binds all interfaces so both hostnames reach the same server.
    host: true,
    proxy: {
      // 127.0.0.1, not "localhost" — Node's dual-stack resolution of "localhost" (racing ::1
      // against 127.0.0.1) is flaky under some environments' network stacks, surfacing as
      // intermittent ECONNREFUSED/EADDRINUSE/ENOBUFS from the proxy for no code-level reason.
      // Pinning to the literal IPv4 address sidesteps the race entirely.
      '/api': { target: `http://127.0.0.1:${aiServerPort}`, changeOrigin: true },
      '/onedev-api': {
        target: 'http://127.0.0.1:6610',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/onedev-api/, '/~api'),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Authorization', onedevAuth)
            proxyReq.setHeader('Accept', 'application/json')
          })
        },
      },
      // IPF: Mattermost (Team Messaging). Just a network hop — no credential injection needed,
      // the incoming webhook URL itself is the auth.
      '/mattermost-api': {
        target: 'http://127.0.0.1:8065',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mattermost-api/, ''),
      },
    },
  },
})
