import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

export default defineConfig({
  plugins: [react(), libInjectCss()],
  build: {
    copyPublicDir: false,
    lib: {
      entry: {
        'orizz-ui': resolve(import.meta.dirname, 'src/build.ts'),
      },
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
      cssFileName: 'orizz-ui',
    },
    rolldownOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
    sourcemap: true,
  },
})
