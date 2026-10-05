import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/vendor-entry.js'),
      formats: ['es'],
      fileName: () => 'qrcode.js',
    },
    outDir: '.vendor-build',
    emptyOutDir: true,
    minify: true,
  },
});
