import { db, schema } from "../db/client";
import { sql } from "drizzle-orm";

export async function searchSemantic(
  embedding: number[],
  limit = 20
) {
  if (!db || !embedding.length) return [];

  try {
    const results = await db
      .select({
        id: schema.articles.id,
        title: schema.articles.title,
        summary: schema.articles.summary,
        feedTitle: schema.feeds.title,
        feedCategory: schema.feeds.category,
      })
      .from(schema.articles)
      .leftJoin(schema.feeds, sql`${schema.articles.feedId} = ${schema.feeds.id}`)
      .where(sql`${schema.articles.embeddingVec} IS NOT NULL`)
      .limit(limit);

    return results;
  } catch {
    return [];
  }
}
