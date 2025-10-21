import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/organic-ui/',
  plugins: [tailwindcss()],
})
