import { db, schema } from "../db/client";
import { eq } from "drizzle-orm";

export async function getUserFromSupabaseId(
  supabaseId: string
): Promise<typeof schema.users.$inferSelect | null> {
  if (!db) return null;
  const users = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.supabaseId, supabaseId))
    .limit(1);
  return users[0] ?? null;
}

export async function ensureUser(supabaseId: string, email: string) {
  if (!db) return null;
  const existing = await getUserFromSupabaseId(supabaseId);
  if (existing) return existing;

  const inserted = await db
    .insert(schema.users)
    .values({ supabaseId, email })
    .onConflictDoNothing()
    .returning();
  return inserted[0] ?? null;
}
