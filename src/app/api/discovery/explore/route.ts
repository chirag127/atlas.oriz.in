import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { desc, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get("category");
    const limit = parseInt(url.searchParams.get("limit") ?? "20", 10);

    if (!db) {
      return NextResponse.json({ explore: [] });
    }

    const conditions = [];
    if (category) conditions.push(sql`${schema.feeds.category} = ${category}`);

    const explore = await db
      .select({
        id: schema.articles.id,
        title: schema.articles.title,
        summary: schema.articles.summary,
        url: schema.articles.url,
        feedTitle: schema.feeds.title,
        feedCategory: schema.feeds.category,
        publishedAt: schema.articles.publishedAt,
      })
      .from(schema.articles)
      .leftJoin(schema.feeds, sql`${schema.articles.feedId} = ${schema.feeds.id}`)
      .orderBy(desc(schema.articles.publishedAt))
      .limit(limit);

    return NextResponse.json({ explore });
  } catch (error) {
    console.error("[Explore] error:", error);
    return NextResponse.json({ explore: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, categories } = await request.json();
    return NextResponse.json({
      explore: [],
      message: `Explore would search for "${query}" in categories: ${(categories ?? []).join(", ")}`,
      placeholder: true,
    });
  } catch (error) {
    console.error("[Explore Post] error:", error);
    return NextResponse.json({ explore: [] });
  }
}
