import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// host: true gör att servern lyssnar på 0.0.0.0 så mobilen på samma WiFi når den
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5174,
  },
})
