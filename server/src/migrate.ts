import 'dotenv/config';

import { resolve } from 'node:path';

import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

import { validateEnvironment } from './infrastructure/config/environment';

async function run(): Promise<void> {
  const environment = validateEnvironment(process.env);
  const pool = new Pool({ connectionString: environment.DATABASE_URL, max: 1 });
  try {
    await migrate(drizzle({ client: pool }), {
      migrationsFolder: resolve(__dirname, '../drizzle'),
    });
    console.info('Database migrations completed');
  } finally {
    await pool.end();
  }
}

void run();
