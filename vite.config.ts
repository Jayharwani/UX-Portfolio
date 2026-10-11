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

export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss(), cloudflareSpaPulgin()],

  /* Hard rule: no debug code in production. Stripping it at build time means a
     stray console.log cannot ship even if review misses it. */
  esbuild: command === 'build' ? { drop: ['console', 'debugger'] } : {},

  define: {
    __ISSUE__: JSON.stringify(new Date().toISOString().slice(0, 7).replace('-', '.')),
  },
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
        /* Function form, not the object form. The object form matches whole
           package entry points, so `gsap/ScrollTrigger` and
           `three/examples/jsm/...` were landing back in the page chunk rather
           than the vendor chunk they belong to. */
        manualChunks(id: string) {
          if (!id.includes('node_modules')) return;
          if (/node_modules[\/](react|react-dom|react-router|scheduler)[\/]/.test(id)) return 'react';
          if (/node_modules[\/](motion|framer-motion|motion-dom|motion-utils)[\/]/.test(id)) return 'motion';
          if (/node_modules[\/]gsap[\/]/.test(id)) return 'gsap';
          if (/node_modules[\/]three[\/]/.test(id)) return 'three';
          if (/node_modules[\/]lenis[\/]/.test(id)) return 'lenis';
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
}));
