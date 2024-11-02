import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        { src: 'src/index.html', dest: '' },
        { src: 'node_modules/scichart/_wasm/scichart2d.data', dest: '' },
        { src: 'node_modules/scichart/_wasm/scichart2d.wasm', dest: '' },
        { src: 'node_modules/scichart/_wasm/scichart3d.data', dest: '' },
        { src: 'node_modules/scichart/_wasm/scichart3d.wasm', dest: '' },
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: './src/index.tsx', // Główne wejście aplikacji
      output: {
        entryFileNames: 'bundle.js',
        dir: 'build',
      },
    },
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
})