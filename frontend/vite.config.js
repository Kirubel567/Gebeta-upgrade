import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expose to network (allows phone access via IP)
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend port
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // Do NOT rewrite if backend routes start with /api
      }
    }
  }
})