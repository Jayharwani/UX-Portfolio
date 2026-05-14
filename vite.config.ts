import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import fs from 'fs';

import { cloudflare } from "@cloudflare/vite-plugin";

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
  plugins: [react(), tailwindcss(), cloudflareSpaPulgin(), cloudflare()],
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
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});