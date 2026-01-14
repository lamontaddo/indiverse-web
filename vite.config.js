import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const IS_GITHUB_PAGES =
  typeof process !== 'undefined' &&
  process.env &&
  process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  plugins: [react()],

  // ✅ IMPORTANT for GitHub Pages
  base: IS_GITHUB_PAGES ? '/indiverse-web/' : '/',

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true,
        secure: false,
      },
      '/checkout': {
        target: 'http://localhost:5050',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
