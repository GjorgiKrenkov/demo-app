import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
  server: {
    port: 5173,
    proxy: {
      '/trpc': {
        target: process.env['VITE_API_BASE_URL'] ?? 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
          trpc: ['@trpc/client', '@trpc/react-query'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
});