import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { devApiPlugin } from './devApiPlugin.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), devApiPlugin()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
})
