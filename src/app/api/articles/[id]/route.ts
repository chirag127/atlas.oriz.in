import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { articles, userArticleInteractions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    const [article] = await db
      .select()
      .from(articles)
      .where(eq(articles.id, id))
      .limit(1);

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("[API] article GET error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!db) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 });
    }

    // Update interaction
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (body.read !== undefined) {
      updates.read = body.read;
      if (body.read) updates.readAt = new Date();
    }
    if (body.readProgress !== undefined) updates.readProgress = body.readProgress;
    if (body.dismissed !== undefined) updates.dismissed = body.dismissed;

    await db
      .update(userArticleInteractions)
      .set(updates)
      .where(eq(userArticleInteractions.articleId, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] article PATCH error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
