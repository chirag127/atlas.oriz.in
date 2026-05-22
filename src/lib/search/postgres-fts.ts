import { db, schema } from "../db/client";
import { sql, ilike, or } from "drizzle-orm";

export async function searchPostgres(
  query: string,
  limit = 20
) {
  if (!db) return [];

  const results = await db
    .select({
      id: schema.articles.id,
      title: schema.articles.title,
      summary: schema.articles.summary,
      feedTitle: schema.feeds.title,
    })
    .from(schema.articles)
    .leftJoin(schema.feeds, sql`${schema.articles.feedId} = ${schema.feeds.id}`)
    .where(
      or(
        ilike(schema.articles.title, `%${query}%`),
        ilike(schema.articles.summary, `%${query}%`),
        ilike(schema.articles.tags, `%${query}%`)
      )
    )
    .limit(limit);

  return results;
}
