import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { articles, bookmarks, notes, highlights } from "@/lib/db/schema";

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({
        articles: [],
        bookmarks: [],
        notes: [],
        highlights: [],
        message: "No database configured",
      });
    }

    const [allArticles, allBookmarks, allNotes, allHighlights] = await Promise.all([
      db.select().from(articles).limit(1000),
      db.select().from(bookmarks).limit(1000),
      db.select().from(notes).limit(1000),
      db.select().from(highlights).limit(1000),
    ]);

    return NextResponse.json({
      articles: allArticles,
      bookmarks: allBookmarks,
      notes: allNotes,
      highlights: allHighlights,
      exportedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[API] export error:", error);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
