import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs';

//DAVID NÃO MEXA NESTE ARQUIVO
export default defineConfig({
    plugins: [react()],
    server: {
        allowedHosts: ['zelloapp.com.br'],
        host: '0.0.0.0',
        port: 5173,
        https: {
            cert: fs.readFileSync('/home/zelloapp/.ssl/fullchain.pem'),
            key: fs.readFileSync('/home/zelloapp/.ssl/privkey.pem'),
        },
        proxy: {
            '/usuario': {
                target: 'https://www.zelloapp.com.br:5171/',
                changeOrigin: true,
                secure: false, // Se o backend usa certificado autoassinado
            },
        },
        hmr: {
            protocol: 'wss',
            host: 'zelloapp.com.br',
            port: 5173,
        },
    },
});