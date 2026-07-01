import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
    server: {
        allowedHosts: ["meet-florida-routers-coverage.trycloudflare.com"],
    },
    plugins: [react()],
});
