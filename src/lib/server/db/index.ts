// import { drizzle } from 'drizzle-orm/better-sqlite3';
// import Database from 'better-sqlite3';
// import { env } from '$env/dynamic/private';
// if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
// const client = new Database(env.DATABASE_URL);
// export const db = drizzle(client);
// This version works for Cloudflare Workers/D1 using Drizzle's HTTP driver.
// You must provide the D1 binding (e.g., from the platform/env object in SvelteKit endpoints).

import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';
import * as schema from './schema';

// Usage: Pass the D1Database binding from the platform/env object where needed.
// Example in a SvelteKit endpoint:
//   const db = drizzle(platform.env.DB);

export { drizzle };
export type { D1Database };

/**
 * When needing a db instance in a SvelteKit endpoint or action,
 * you can use this function to get a Drizzle instance connected to the D1 database.
 * ```
 * const db = database(event);
 * ```
 */  
export let database = async (event: any) => {
  const d1 = (event.platform as { env: { DB: D1Database, DEV_DB_AUTOCREATE?: string } }).env.DB;
    const db = drizzle(d1, { schema });

    const isDev = (event.platform?.env?.DEV_DB_AUTOCREATE === 'true');

    if (isDev) {
        // Use D1 binding directly for raw SQL
        const tablesRes = await d1.prepare(
            `SELECT name FROM sqlite_master WHERE type='table' AND name IN ('user','session');`
        ).all();
        const foundTables = new Set(tablesRes.results?.map((row: any) => row.name));

        if (!foundTables.has('user')) {
            await d1.prepare(CREATE_USER_TABLE_SQL).run();
        }
        if (!foundTables.has('session')) {
            await d1.prepare(CREATE_SESSION_TABLE_SQL).run();
        }
    }
  return db;
}

const CREATE_USER_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS user (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password_hash TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    google_id TEXT UNIQUE
);
`;

const CREATE_SESSION_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS session (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES user(id),
    expires_at INTEGER NOT NULL
);
`;