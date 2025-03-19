import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ["appear-compressed-impressed-millennium.trycloudflare.com"],
  },
  plugins: [react()],
})
