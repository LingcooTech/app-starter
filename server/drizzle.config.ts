import 'dotenv/config';

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/**/*.schema.ts',
  out: './drizzle',
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      'postgres://lingcoo_app:lingcoo_app_password@localhost:5438/lingcoo_app',
  },
  strict: true,
  verbose: true,
});
