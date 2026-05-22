import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { bookmarks, articles } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ bookmarks: [] });
    }

    const results = await db
      .select({
        id: bookmarks.id,
        articleId: bookmarks.articleId,
        note: bookmarks.note,
        due: bookmarks.due,
        state: bookmarks.state,
        createdAt: bookmarks.createdAt,
        title: articles.title,
        url: articles.url,
        summary: articles.summary,
        readingTime: articles.readingTime,
        tags: articles.tags,
      })
      .from(bookmarks)
      .leftJoin(articles, eq(bookmarks.articleId, articles.id))
      .orderBy(desc(bookmarks.createdAt))
      .limit(100);

    return NextResponse.json({ bookmarks: results });
  } catch (error) {
    console.error("[API] bookmarks GET error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, note } = body;

    if (!articleId) {
      return NextResponse.json({ error: "articleId required" }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ success: true, message: "No DB — bookmark saved locally" });
    }

    // Check if already bookmarked
    const existing = await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.articleId, articleId))
      .limit(1);

    if (existing.length > 0) {
      // Remove bookmark (toggle)
      await db.delete(bookmarks).where(eq(bookmarks.articleId, articleId));
      return NextResponse.json({ bookmarked: false });
    }

    const [created] = await db
      .insert(bookmarks)
      .values({
        userId: "00000000-0000-0000-0000-000000000000", // TODO: get from auth
        articleId,
        note,
        due: new Date(),
      })
      .returning();

    return NextResponse.json({ bookmarked: true, bookmark: created });
  } catch (error) {
    console.error("[API] bookmarks POST error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
