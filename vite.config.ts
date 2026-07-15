import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  const environment = loadEnv(mode, process.cwd(), 'VITE_');
  const configuredRemoteApiOrigin = environment.VITE_REMOTE_API_ORIGIN;
  if (mode === 'production' && !configuredRemoteApiOrigin) {
    throw new Error(
      'VITE_REMOTE_API_ORIGIN must contain the deployed workers.dev origin.'
    );
  }
  const remoteApiUrl = new URL(
    configuredRemoteApiOrigin || 'http://127.0.0.1:8787'
  );
  const localWorker =
    mode !== 'production' &&
    remoteApiUrl.protocol === 'http:' &&
    (remoteApiUrl.hostname === 'localhost' ||
      remoteApiUrl.hostname === '127.0.0.1');
  if (
    remoteApiUrl.username !== '' ||
    remoteApiUrl.password !== '' ||
    remoteApiUrl.pathname !== '/' ||
    remoteApiUrl.search !== '' ||
    remoteApiUrl.hash !== '' ||
    (!localWorker &&
      (remoteApiUrl.protocol !== 'https:' ||
        !remoteApiUrl.hostname.endsWith('.workers.dev')))
  ) {
    throw new Error('VITE_REMOTE_API_ORIGIN must be a valid Worker origin.');
  }
  const remoteApiOrigin = remoteApiUrl.origin;

  return {
    base: environment.VITE_BASE_PATH || '/',
    define: {
      'import.meta.env.VITE_REMOTE_API_ORIGIN': JSON.stringify(remoteApiOrigin),
    },
    plugins: [
      react(),
      {
        name: 'remote-api-csp',
        transformIndexHtml(html) {
          return html.replace('__REMOTE_API_ORIGIN__', remoteApiOrigin);
        },
      },
    ],
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
