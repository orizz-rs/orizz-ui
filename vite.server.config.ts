import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  build: {
    copyPublicDir: false,
    emptyOutDir: false,
    lib: {
      entry: {
        'orizz-ui': resolve(import.meta.dirname, 'src/build.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format) =>
        `index.server.${format === 'es' ? 'js' : 'cjs'}`,
      cssFileName: 'orizz-ui',
    },
    rolldownOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    sourcemap: true,
  },
})
