import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { articles, discoveryResults } from "@/lib/db/schema";
import { lt, sql } from "drizzle-orm";

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

    // Delete articles older than 90 days
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const deleted = await db
      .delete(articles)
      .where(lt(articles.createdAt, ninetyDaysAgo))
      .returning();

    // Clean up old discovery results
    await db
      .delete(discoveryResults)
      .where(lt(discoveryResults.createdAt, ninetyDaysAgo));

    return NextResponse.json({
      success: true,
      articlesDeleted: deleted.length,
    });
  } catch (error) {
    console.error("[Cron] cleanup error:", error);
    return NextResponse.json({ error: "Cleanup failed" }, { status: 500 });
  }
}
