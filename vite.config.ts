import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import AutoImport from 'unplugin-auto-import/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    AutoImport({
      imports: ['vue', 'pinia'],
      dts: 'src/auto-imports.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    copyPublicDir: true,
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'popup.html'),
        editor: path.resolve(__dirname, 'editor.html'),
        background: path.resolve(__dirname, 'src/popup/background.ts'),
        content: path.resolve(__dirname, 'src/popup/content-scripts/content.ts'),
      },
      output: {
        entryFileNames: (chunk) => {
          if (chunk.name === 'background') return 'src/popup/background.js';
          if (chunk.name === 'content') return 'src/popup/content-scripts/content.js';
          return '[name].js';
        },
      },
    },
    emptyOutDir: true,
    sourcemap: false,
    target: 'esnext',
  },
});
