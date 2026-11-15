import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { memoryDb } from './memory-db';

const databaseUrl = process.env.DATABASE_URL;

const isLivePostgresUrl =
  Boolean(databaseUrl) &&
  !databaseUrl?.includes('ep-sample-pooler') &&
  !databaseUrl?.includes('placeholder') &&
  databaseUrl?.startsWith('postgres');

export const db: any = isLivePostgresUrl
  ? drizzle(neon(databaseUrl!), { schema })
  : memoryDb;
