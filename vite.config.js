import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  build: {
    // Split vendor chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Firebase in its own chunk — large but rarely changes
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          // React ecosystem
          react:    ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    // Warn if any chunk > 500KB
    chunkSizeWarningLimit: 500,
    // Enable source maps for production debugging
    sourcemap: false,
    // Minify with terser for smaller output
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove all console.log in production
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  // Optimize deps — pre-bundle these for faster dev start
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },

  // Resolve aliases
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
