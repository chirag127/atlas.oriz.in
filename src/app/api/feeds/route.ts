import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { feeds, userFeeds } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { FEED_SOURCES } from "@/lib/feeds/sources";

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({
        feeds: FEED_SOURCES.map((f, i) => ({
          id: String(i),
          url: f.url,
          title: f.title,
          category: f.category,
          isActive: true,
          articleCount: 0,
        })),
      });
    }

    const results = await db
      .select()
      .from(feeds)
      .orderBy(desc(feeds.createdAt))
      .limit(200);

    return NextResponse.json({ feeds: results });
  } catch (error) {
    console.error("[API] feeds GET error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, title, category } = body;

    if (!url || !title) {
      return NextResponse.json({ error: "url and title required" }, { status: 400 });
    }

    if (!db) {
      return NextResponse.json({ success: true, message: "No DB — feed added locally" });
    }

    const [feed] = await db
      .insert(feeds)
      .values({ url, title, category: category ?? "general" })
      .onConflictDoUpdate({
        target: feeds.url,
        set: { title, category: category ?? "general" },
      })
      .returning();

    return NextResponse.json({ feed });
  } catch (error) {
    console.error("[API] feeds POST error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
