import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    globals: true,
    restoreMocks: true,
    clearMocks: true,
    env: {
      // API base URL is same-origin in tests as well.
    }
  },
  resolve: {
    alias: {
      '@/src': new URL('./src', import.meta.url).pathname
    }
  }
})
