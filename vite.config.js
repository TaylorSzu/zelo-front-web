import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs';
import path from 'path';
// https://vite.dev/config/

//DAVID NÃO MEXA NESTE ARQUIVO
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['zelloapp.com.br', 'localhost'],
    host: '0.0.0.0',
    port: 5173,
    https: {
      key: '149092ff7467f365b8d8c68b7e090668af6c41e1ea07da4f1f12d1d075793671',
      cert:'19708bd61cbff47fbd7aeaf7f4e8f5d12c488f508b1d956ebd6123bb3dcbe7d4',
    },
    proxy: {
      '/usuario': {
        target: 'http://localhost:5171',
        changeOrigin: true,
      },
    hmr: {
      protocol: 'wss',
      host: 'zelloapp.com.br',
      port: 5173,
    }
  }
}})
