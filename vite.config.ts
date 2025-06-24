import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  root: './dev-editor',
  plugins: [react()],
  resolve: {
    alias: {
      '~tabs': path.resolve(__dirname, 'src/tabs'),
      '~shared': path.resolve(__dirname, 'src/shared'),
      '~styles': path.resolve(__dirname, 'src/styles'),
      '@plasmohq/storage': path.resolve(
        __dirname,
        'node_modules/@plasmohq/storage'
      ),
    },
  },
})
