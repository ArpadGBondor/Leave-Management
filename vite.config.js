import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => ({
  plugins: [tailwindcss(), svgr(), react()],
  build: {
    target: 'esnext', // modern JS output
    outDir: 'dist',
    sourcemap: mode === 'development', // disable in prod
    cssMinify: true,
    minify: 'terser', // better minification than esbuild for React apps
    terserOptions: {
      compress: {
        drop_console: true, // remove console logs
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('react-icons')) return 'icons';
            if (id.includes('react-router-dom')) return 'router';
            if (id.includes('react')) return 'react';
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'react-icons/fa'],
  },
  esbuild: {
    jsx: 'automatic',
    minify: true,
  },
}));
