import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' để chạy được ở mọi đường dẫn (GitHub Pages: /knowledge-certificate/)
export default defineConfig({
  base: './',
  plugins: [react()],
});
