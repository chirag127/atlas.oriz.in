import { defineConfig } from "drizzle-kit";
// @ts-ignore
import { loadEnvConfig } from "@next/env";


loadEnvConfig(process.cwd());

const dbUrl = process.env.DATABASE_URL ?? "";
const migrationDbUrl = dbUrl.replace(":6543/", ":5432/");

export default defineConfig({
  schema: "./src/lib/db/schema.ts",
  out: "./src/lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: migrationDbUrl,
  },
});


