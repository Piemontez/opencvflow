import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
//import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    //
    react(),
    //dts(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          monacoeditor: ['@monaco-editor/react'],
          opencvts: ['opencv-ts'],
        },
        entryFileNames: '[name]_[hash].js',
        chunkFileNames: 'deps/[name].js',
      },
    },
  },
});
