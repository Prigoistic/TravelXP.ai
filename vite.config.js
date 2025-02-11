import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      external: [
        'firebase/auth',
        'firebase/app',
        'firebase/firestore',
        'firebase/storage',
        'firebase/analytics',
        'react-icons/fa',
        'three'
      ]
    }
  },
  server: {
    port: 3000
  }
})
