import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setupTests.ts'],
    include: ['**/*.test.{ts,tsx}'],
    deps: { inline: ['three', '@react-three/*'] },
  },
});
