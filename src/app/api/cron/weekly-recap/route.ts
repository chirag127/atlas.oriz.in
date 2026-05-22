import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { articles, gamificationStats } from "@/lib/db/schema";
import { desc, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!db) {
      return NextResponse.json({ message: "No DB configured" });
    }

    // Get stats from last week
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const weeklyArticles = await db
      .select({ count: sql<number>`count(*)` })
      .from(articles)
      .where(sql`${articles.createdAt} > ${weekAgo}`);

    return NextResponse.json({
      success: true,
      articlesThisWeek: weeklyArticles[0]?.count ?? 0,
    });
  } catch (error) {
    console.error("[Cron] weekly-recap error:", error);
    return NextResponse.json({ error: "Recap failed" }, { status: 500 });
  }
}
