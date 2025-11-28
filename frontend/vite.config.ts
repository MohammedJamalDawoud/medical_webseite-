import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // @ts-ignore - test config is from vitest
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/vitest.setup.ts',
  },
})
