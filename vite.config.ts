import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), 'VITE_');

  return {
    base: environment.VITE_BASE_PATH || '/',
    plugins: [react()],
    build: {
      outDir: 'dist',
      sourcemap: false,
      target: ['chrome117', 'edge121', 'firefox121', 'safari17'],
    },
    test: {
      environment: 'jsdom',
      environmentOptions: {
        jsdom: {
          url: 'http://localhost/',
        },
      },
      setupFiles: ['./src/setupTests.ts'],
      unstubGlobals: true,
    },
  };
});
