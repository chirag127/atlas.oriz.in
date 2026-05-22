import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { articles } from "@/lib/db/schema";
import { ilike, or, desc, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get("q");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 50);

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [], query });
    }

    if (!db) {
      return NextResponse.json({
        results: [
          { id: "1", title: `Search result for "${query}"`, url: "#", summary: "Configure a database to enable full-text search.", sourceName: "Demo" },
        ],
        query,
      });
    }

    const results = await db
      .select({
        id: articles.id,
        title: articles.title,
        url: articles.url,
        summary: articles.summary,
        publishedAt: articles.publishedAt,
        readingTime: articles.readingTime,
        tags: articles.tags,
      })
      .from(articles)
      .where(
        or(
          ilike(articles.title, `%${query}%`),
          ilike(articles.summary, `%${query}%`)
        )
      )
      .orderBy(desc(articles.publishedAt))
      .limit(limit);

    return NextResponse.json({ results, query });
  } catch (error) {
    console.error("[API] search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
