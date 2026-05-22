import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { articles, feeds } from "@/lib/db/schema";
import { desc, eq, and, sql, ilike } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20"), 100);
    const category = searchParams.get("category");
    const feedId = searchParams.get("feedId");
    const search = searchParams.get("q");
    const offset = (page - 1) * limit;

    if (!db) {
      // Return demo articles when no DB configured
      return NextResponse.json({
        articles: getDemoArticles(limit),
        total: limit,
        page,
        hasMore: false,
      });
    }

    const conditions = [];
    if (feedId) conditions.push(eq(articles.feedId, feedId));
    if (search) conditions.push(ilike(articles.title, `%${search}%`));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const results = await db
      .select({
        id: articles.id,
        feedId: articles.feedId,
        url: articles.url,
        title: articles.title,
        author: articles.author,
        summary: articles.summary,
        imageUrl: articles.imageUrl,
        publishedAt: articles.publishedAt,
        wordCount: articles.wordCount,
        readingTime: articles.readingTime,
        tags: articles.tags,
        aiSummary: articles.aiSummary,
        qualityScore: articles.qualityScore,
        feedTitle: feeds.title,
        feedCategory: feeds.category,
      })
      .from(articles)
      .leftJoin(feeds, eq(articles.feedId, feeds.id))
      .where(where)
      .orderBy(desc(articles.publishedAt))
      .limit(limit)
      .offset(offset);

    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(articles)
      .where(where);

    const total = countResult[0]?.count ?? 0;

    return NextResponse.json({
      articles: results.map((a) => ({
        ...a,
        sourceName: a.feedTitle,
        category: a.feedCategory,
        tags: Array.isArray(a.tags) ? a.tags : [],
      })),
      total,
      page,
      hasMore: offset + limit < total,
    });
  } catch (error) {
    console.error("[API] articles GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

function getDemoArticles(limit: number) {
  const demos = [
    { id: "1", title: "The Future of AI Agents in 2026", url: "#", author: "Demo", summary: "Exploring how autonomous AI agents are transforming software development and daily workflows.", imageUrl: null, publishedAt: new Date().toISOString(), wordCount: 1500, readingTime: 6, tags: ["ai", "agents", "future"], aiSummary: null, qualityScore: 85, sourceName: "Hacker News", category: "AI" },
    { id: "2", title: "Building Offline-First PWAs with Serwist", url: "#", author: "Demo", summary: "A comprehensive guide to implementing service workers and offline functionality in Next.js apps.", imageUrl: null, publishedAt: new Date(Date.now() - 3600000).toISOString(), wordCount: 2000, readingTime: 8, tags: ["pwa", "nextjs", "offline"], aiSummary: null, qualityScore: 78, sourceName: "DEV.to", category: "Engineering" },
    { id: "3", title: "India's UPI Revolution: 10 Billion Transactions", url: "#", author: "Demo", summary: "How India's Unified Payments Interface crossed 10 billion monthly transactions.", imageUrl: null, publishedAt: new Date(Date.now() - 7200000).toISOString(), wordCount: 1200, readingTime: 5, tags: ["finance", "india", "upi"], aiSummary: null, qualityScore: 72, sourceName: "Finshots", category: "Finance" },
    { id: "4", title: "Zero-Knowledge Proofs Explained Simply", url: "#", author: "Demo", summary: "Understanding ZK proofs without a math PhD — practical applications and why they matter.", imageUrl: null, publishedAt: new Date(Date.now() - 10800000).toISOString(), wordCount: 1800, readingTime: 7, tags: ["crypto", "privacy", "math"], aiSummary: null, qualityScore: 90, sourceName: "Schneier", category: "Security" },
    { id: "5", title: "The Best Free AI APIs for Developers", url: "#", author: "Demo", summary: "A curated list of the best free AI APIs available in 2026, from Gemini to Groq to Cerebras.", imageUrl: null, publishedAt: new Date(Date.now() - 14400000).toISOString(), wordCount: 2500, readingTime: 10, tags: ["ai", "api", "free"], aiSummary: null, qualityScore: 82, sourceName: "Fireship", category: "AI" },
  ];
  return demos.slice(0, limit);
}
