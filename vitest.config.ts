import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setupTests.ts'],
    include: ['**/*.test.{ts,tsx}'],
    deps: { inline: ['three', '@react-three/*'] },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
