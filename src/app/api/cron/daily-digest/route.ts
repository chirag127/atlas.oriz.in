import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { articles } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!db) {
      return NextResponse.json({ message: "No DB configured — skipping daily digest" });
    }

    // Get top articles from last 24 hours
    const topArticles = await db
      .select({
        title: articles.title,
        summary: articles.summary,
        url: articles.url,
      })
      .from(articles)
      .orderBy(desc(articles.qualityScore))
      .limit(10);

    if (topArticles.length === 0) {
      return NextResponse.json({ message: "No articles for digest" });
    }

    // Generate digest (would use AI in production)
    const digest = topArticles
      .map((a, i) => `${i + 1}. ${a.title}\n   ${a.summary ?? "No summary"}`)
      .join("\n\n");

    return NextResponse.json({
      success: true,
      articleCount: topArticles.length,
      digest,
    });
  } catch (error) {
    console.error("[Cron] daily-digest error:", error);
    return NextResponse.json({ error: "Digest failed" }, { status: 500 });
  }
}
