import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['test/**/*.spec.ts'],
    env: {
      NODE_ENV: 'test',
      APP_NAME: 'lingcoo-app-starter-test',
      APP_VERSION: 'test',
      API_HOST: '127.0.0.1',
      API_PORT: '8090',
      CORS_ORIGIN: 'http://localhost:5173',
      DATABASE_URL: 'postgres://test:test@127.0.0.1:5438/test',
      API_DOCS_ENABLED: 'false',
    },
  },
});
