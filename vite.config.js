import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // /api/* 요청을 FastAPI 서버로 전달 → CORS 문제 회피
    proxy: {
      '/api': {
        target: 'http://3.34.222.61',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
