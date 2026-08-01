import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/metrics': 'http://localhost:4000',
      '/targets': 'http://localhost:4000',
      '/alerts':  'http://localhost:4000',
    }
  }
})
