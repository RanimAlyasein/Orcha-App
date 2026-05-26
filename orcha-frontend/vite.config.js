import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    // Dev proxy: forwards /api/ to the local backend.
    // In Docker, nginx handles this routing instead.
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3010',
        changeOrigin: true,
      },
    },
  },
});
