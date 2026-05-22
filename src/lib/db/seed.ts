import { db, schema } from "./client";
import { FEED_SOURCES } from "../feeds/sources";

async function seed() {
  if (!db) {
    console.error("[Seed] DATABASE_URL not set");
    process.exit(1);
  }

  console.log("[Seed] Seeding feeds...");

  for (const source of FEED_SOURCES) {
    try {
      await db
        .insert(schema.feeds)
        .values({
          url: source.url,
          title: source.title,
          category: source.category,
          siteUrl: source.siteUrl,
          isActive: true,
        })
        .onConflictDoNothing();
    } catch (e) {
      console.error(`[Seed] Failed to insert ${source.title}:`, e);
    }
  }

  console.log(`[Seed] Seeded ${FEED_SOURCES.length} feeds`);
  process.exit(0);
}

seed();
