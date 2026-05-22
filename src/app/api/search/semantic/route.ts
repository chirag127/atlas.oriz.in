import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { eq, ilike, or, desc } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { query, limit, offset } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query required" }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ results: [], message: "No DB" });
    }

    const results = await db
      .select()
      .from(schema.articles)
      .where(
        or(
          ilike(schema.articles.title, `%${query}%`),
          ilike(schema.articles.summary ?? "", `%${query}%`),
          ilike(schema.articles.content ?? "", `%${query}%`)
        )
      )
      .orderBy(desc(schema.articles.publishedAt))
      .limit(limit ?? 20)
      .offset(offset ?? 0);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("[Semantic Search] error:", error);
    return NextResponse.json({ results: [] });
  }
}
