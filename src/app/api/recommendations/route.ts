import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { articles, feeds } from "@/lib/db/schema";
import { desc, eq, and, sql } from "drizzle-orm";

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({ recommendations: [], message: "No DB configured" });
    }

    const recs = await db
      .select({
        id: articles.id,
        title: articles.title,
        summary: articles.summary,
        feedTitle: feeds.title,
        feedCategory: feeds.category,
        publishedAt: articles.publishedAt,
        qualityScore: articles.qualityScore,
      })
      .from(articles)
      .leftJoin(feeds, eq(articles.feedId, feeds.id))
      .orderBy(
        desc(
          sql`${articles.qualityScore} * 0.3 + extract(epoch from ${articles.publishedAt}) / 86400 * 0.2`
        )
      )
      .limit(20);

    return NextResponse.json({
      recommendations: recs.map((a) => ({
        ...a,
        sourceName: a.feedTitle,
        category: a.feedCategory,
        score: (a.qualityScore ?? 50) * 0.3 + 0.2,
      })),
    });
  } catch (error) {
    console.error("[Recommendations] error:", error);
    return NextResponse.json({ recommendations: [] });
  }
}
