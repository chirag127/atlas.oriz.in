import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
// @ts-ignore
import { loadEnvConfig } from "@next/env";


// Load environment variables for standalone scripts or tooling outside Next.js
if (!process.env.DATABASE_URL) {
  loadEnvConfig(process.cwd());
}

const connectionString = process.env.DATABASE_URL;

const _PLACEHOLDER = /^[A-Z_\-\]]+$/;

function createDb() {
  if (!connectionString) {
    console.warn("[DB] DATABASE_URL not set — database features disabled");
    return null;
  }
  const pw = connectionString.split("@")[0]?.split(":")[2] ?? "";
  if (_PLACEHOLDER.test(pw)) {
    console.warn(
      "[DB] DATABASE_URL password looks like a placeholder — " +
        "database features disabled"
    );
    return null;
  }
  const client = postgres(connectionString, { prepare: false });
  return drizzle(client, { schema });
}

const globalForDb = globalThis as unknown as { db: ReturnType<typeof createDb> };
export const db = globalForDb.db ?? createDb();
if (process.env.NODE_ENV !== "production") globalForDb.db = db;

export { schema };
