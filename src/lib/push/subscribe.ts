import { db, schema } from "../db/client";
import { eq } from "drizzle-orm";

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export async function subscribeUser(
  userId: string,
  subscription: PushSubscription
) {
  if (!db) return;
  await db.insert(schema.pushSubscriptions).values({
    userId,
    endpoint: subscription.endpoint,
    keys: subscription.keys as unknown as Record<string, unknown>,
    userAgent: null,
  }).onConflictDoNothing({ target: [schema.pushSubscriptions.userId, schema.pushSubscriptions.endpoint] });
}

export async function unsubscribeUser(
  userId: string,
  endpoint: string
) {
  if (!db) return;
  await db
    .delete(schema.pushSubscriptions)
    .where(eq(schema.pushSubscriptions.endpoint, endpoint));
}

export async function getSubscriptions(
  userId: string
): Promise<PushSubscription[]> {
  if (!db) return [];
  const subs = await db
    .select()
    .from(schema.pushSubscriptions)
    .where(eq(schema.pushSubscriptions.userId, userId));
  return subs.map((s) => ({
    endpoint: s.endpoint,
    keys: s.keys as unknown as PushSubscription["keys"],
  }));
}
