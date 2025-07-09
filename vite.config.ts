// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/', // since you're using a custom domain
  build: {
    outDir: 'dist',
    target: 'esnext',
  }
});
