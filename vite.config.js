import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Keep built assets relative so the app also works under a GitHub Pages repository path.
  base: './',
});
