import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

// vite.config.ts
{/*export default defineConfig({
  base: '/BILLING_frontend_react/', // Must match your repo name exactly
  plugins: [react()],
})*/}