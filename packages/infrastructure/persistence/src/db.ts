/**
 * PostgreSQL connection via postgres.js + Drizzle.
 * Connection string from DATABASE_URL (or test default).
 */

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

export type Database = ReturnType<typeof createDb>;

export function createDb(connectionString?: string) {
  const url =
    connectionString ??
    process.env.DATABASE_URL ??
    "postgres://ailexsi:ailexsi@localhost:5432/ailexsi";
  const client = postgres(url, { max: 10 });
  const db = drizzle(client, { schema });
  return { db, client };
}

export { schema };
