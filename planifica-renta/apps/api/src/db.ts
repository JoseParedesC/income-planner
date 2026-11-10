import pg from 'pg';
import { env } from './env.js';

export const pool = new pg.Pool({
  connectionString: env.databaseUrl,
  ssl: env.pgssl ? { rejectUnauthorized: false } : undefined,
});

const MIGRATIONS: { id: string; sql: string }[] = [
  {
    id: '001_init',
    sql: `
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE TABLE tax_years (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      year INT NOT NULL,
      data JSONB NOT NULL DEFAULT '{}'::jsonb,
      dian_date DATE,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (user_id, year)
    );
    CREATE TABLE checklist_items (
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      year INT NOT NULL,
      item_key TEXT NOT NULL,
      done BOOLEAN NOT NULL DEFAULT false,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      PRIMARY KEY (user_id, year, item_key)
    );`,
  },
];

export async function migrate() {
  const c = await pool.connect();
  try {
    await c.query('SELECT pg_advisory_lock(727274)');
    await c.query('CREATE TABLE IF NOT EXISTS schema_migrations (id TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())');
    const { rows } = await c.query<{ id: string }>('SELECT id FROM schema_migrations');
    const done = new Set(rows.map((r) => r.id));
    for (const m of MIGRATIONS) {
      if (done.has(m.id)) continue;
      await c.query('BEGIN');
      try {
        await c.query(m.sql);
        await c.query('INSERT INTO schema_migrations (id) VALUES ($1)', [m.id]);
        await c.query('COMMIT');
        console.log(`Migración aplicada: ${m.id}`);
      } catch (e) {
        await c.query('ROLLBACK');
        throw e;
      }
    }
  } finally {
    await c.query('SELECT pg_advisory_unlock(727274)').catch(() => {});
    c.release();
  }
}
