import { copyFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { assetManifestPlugin } from './plugins/assetManifest'

export default defineConfig({
  plugins: [
    react(),
    assetManifestPlugin(),
    {
      name: 'gh-pages-spa-fallback',
      closeBundle() {
        copyFileSync('dist/index.html', 'dist/404.html')
      },
    },
  ],
  base: '/duo-daily/',
})
