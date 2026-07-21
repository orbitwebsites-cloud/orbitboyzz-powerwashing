import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        plainsboro: resolve(__dirname, 'pressure-washing-plainsboro/index.html'),
        westWindsor: resolve(__dirname, 'pressure-washing-west-windsor/index.html'),
        ewing: resolve(__dirname, 'pressure-washing-ewing/index.html'),
      },
    },
  },
});
