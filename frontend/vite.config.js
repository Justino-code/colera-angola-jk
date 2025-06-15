import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    allowedHosts: [
      '*'
      //'7495-102-218-85-39.ngrok-free.app'  // 🟢 adicione o domínio gerado pelo ngrok
    ]
  }
});