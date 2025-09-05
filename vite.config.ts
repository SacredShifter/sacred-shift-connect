import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import { sentryVitePlugin } from "@sentry/vite-plugin";

// Sacred Shifter development configuration
export default defineConfig(({ mode }) => {
  const plugins = [
    react(),
  ];

  // Only add Sentry plugin in production with auth token
  if (process.env.SENTRY_AUTH_TOKEN) {
    plugins.push(sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }));
  }

  return {
    server: {
      host: "127.0.0.1",
      port: 5173, // Use Vite's default port
      strictPort: true,
      hmr: mode === 'development' ? {
        port: 5174,
        host: 'localhost'
      } : false, // Enable HMR in development only
      watch: mode === 'development' ? {
        ignored: ['**/node_modules/**', '**/dist/**']
      } : {
        ignored: ['**/*'] // Disable file watching in production
      },
      cors: {
        origin: mode === 'development' ? ['http://localhost:5173', 'http://127.0.0.1:5173'] : false,
        credentials: true
      }
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "events": path.resolve(__dirname, "./src/lib/events-polyfill.ts")
      }
    },
    define: {
      global: 'globalThis',
      __VITE_HMR_DISABLE__: true,
      __VITE_DISABLE_HMR__: true
    },
    optimizeDeps: {
      include: ['simple-peer'],
      exclude: []
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        external: [],
      },
    }
  };
});
