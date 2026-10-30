import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/common/components'),
      '@context': path.resolve(__dirname, 'src/common/context'),
      '@public': path.resolve(__dirname, 'public'),
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: [],
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
});
