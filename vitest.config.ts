import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      '@': '/home/yuv/proj/regex-run/src',
    },
  },
});
