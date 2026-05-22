import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { highlights } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    if (!db) return NextResponse.json({ highlights: [] });

    const results = await db
      .select()
      .from(highlights)
      .orderBy(desc(highlights.createdAt))
      .limit(100);

    return NextResponse.json({ highlights: results });
  } catch (error) {
    console.error("[API] highlights GET error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, text, color, note, startOffset, endOffset } = body;

    if (!articleId || !text) {
      return NextResponse.json({ error: "articleId and text required" }, { status: 400 });
    }

    if (!db) return NextResponse.json({ success: true });

    const [highlight] = await db
      .insert(highlights)
      .values({
        userId: "00000000-0000-0000-0000-000000000000",
        articleId,
        text,
        color: color ?? "yellow",
        note,
        startOffset,
        endOffset,
      })
      .returning();

    return NextResponse.json({ highlight });
  } catch (error) {
    console.error("[API] highlights POST error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
