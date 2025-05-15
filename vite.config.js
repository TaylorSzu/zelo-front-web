import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'zelloapp.com.br',
    port: 5173,
    hmr: {
      protocol: 'ws',
      host: 'zelloapp.com.br',
      port: 5173,
    }
  }
})
