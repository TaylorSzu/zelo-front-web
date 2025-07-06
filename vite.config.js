import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// DAVID NÃO MEXA NESTE ARQUIVO
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['zelloapp.com.br'],
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/usuario': {
        target: 'http://localhost:5171/',
        changeOrigin: true,
      },
    },
    hmr: {
      protocol: 'wss',
      host: 'zelloapp.com.br',
      port: 5173,
    },
  },
})
