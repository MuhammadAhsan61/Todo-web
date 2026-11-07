import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'; // Node built-in module



// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Maps '@' to the 'src' directory
    },
  },
})
