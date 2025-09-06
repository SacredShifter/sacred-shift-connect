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
      hmr: {
        port: 5174, // Use different port for HMR to avoid conflicts
        host: "127.0.0.1",
        clientPort: 5174 // Tell the client to connect to this port
      },
      watch: {
        ignored: ['**/node_modules/**', '**/dist/**'] // Only ignore unnecessary files
      },
      cors: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
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
      global: 'globalThis'
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
