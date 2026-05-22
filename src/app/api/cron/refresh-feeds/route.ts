import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { feeds, articles } from "@/lib/db/schema";
import { fetchAllFeeds } from "@/lib/feeds/fetcher";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!db) {
      return NextResponse.json({ message: "No DB configured — skipping feed refresh" });
    }

    // Get all active feeds
    const activeFeeds = await db
      .select()
      .from(feeds)
      .where(eq(feeds.isActive, true));

    if (activeFeeds.length === 0) {
      return NextResponse.json({ message: "No feeds to refresh" });
    }

    // Fetch all feeds
    const fetchedArticles = await fetchAllFeeds();

    // Insert new articles (skip duplicates)
    let inserted = 0;
    for (const article of fetchedArticles) {
      try {
        await db
          .insert(articles)
          .values({
            url: article.url,
            title: article.title,
            author: article.author,
            content: article.content,
            summary: article.summary,
            imageUrl: article.imageUrl,
            publishedAt: article.publishedAt,
            wordCount: article.wordCount,
            readingTime: article.readingTime,
            tags: article.tags ?? [],
          })
          .onConflictDoNothing();
        inserted++;
      } catch {
        // Duplicate URL, skip
      }
    }

    // Update feed last fetched timestamps
    for (const feed of activeFeeds) {
      await db
        .update(feeds)
        .set({ lastFetchedAt: new Date() })
        .where(eq(feeds.id, feed.id));
    }

    return NextResponse.json({
      success: true,
      feedsProcessed: activeFeeds.length,
      articlesInserted: inserted,
    });
  } catch (error) {
    console.error("[Cron] refresh-feeds error:", error);
    return NextResponse.json({ error: "Feed refresh failed" }, { status: 500 });
  }
}
