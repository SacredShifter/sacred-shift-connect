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
      host: '127.0.0.1',
      port: 8080,
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      }
    },
    build: {
      sourcemap: true,
    }
  };
});
