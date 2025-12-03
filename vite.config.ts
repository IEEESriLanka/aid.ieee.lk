import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: This ensures assets are loaded correctly on GitHub Pages (subdirectories)
  base: './',
  resolve: {
    alias: {
      // Maps '@' to the project root for imports
      '@': path.resolve('./'),
    },
  },
});