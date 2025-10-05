import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // importante para deploy estático
  build: {
    outDir: 'dist' // pasta de saída do build
  }
});
