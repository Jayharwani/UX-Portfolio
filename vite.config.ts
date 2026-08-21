import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

// Cloudflare Pages SPA routing: copy index.html → 404.html so all routes serve the app
function cloudflareSpaPulgin() {
  return {
    name: 'cloudflare-spa',
    closeBundle() {
      const outDir = 'build';
      const src = path.resolve(__dirname, outDir, 'index.html');
      const dest = path.resolve(__dirname, outDir, '404.html');
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflareSpaPulgin()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        /*
         * Vendor code was landing in one 503 KB main chunk together with the
         * homepage, so any change to the site busted the cache on all of it and
         * the browser had to parse the lot before first paint.
         *
         * These libraries change only when they are upgraded, so they are split
         * out to be cached across deploys and fetched in parallel. Only split
         * what the homepage genuinely needs up front — lucide-react is left
         * alone deliberately, since it is imported solely by the lazy
         * case-study routes and grouping it here would pull it onto the
         * homepage's critical path.
         */
        manualChunks: {
          react: ['react', 'react-dom', 'react-router'],
          motion: ['motion'],
          gsap: ['gsap'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
