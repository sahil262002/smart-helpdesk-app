import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add this 'test' section
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.js', // Optional: for setup before tests
  },
})