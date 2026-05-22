import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { notes } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  try {
    if (!db) return NextResponse.json({ notes: [] });

    const results = await db
      .select()
      .from(notes)
      .orderBy(desc(notes.updatedAt))
      .limit(100);

    return NextResponse.json({ notes: results });
  } catch (error) {
    console.error("[API] notes GET error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, articleId } = body;

    if (!title) {
      return NextResponse.json({ error: "title required" }, { status: 400 });
    }

    if (!db) return NextResponse.json({ success: true });

    const [note] = await db
      .insert(notes)
      .values({
        userId: "00000000-0000-0000-0000-000000000000",
        title,
        content: content ?? "",
        articleId,
      })
      .returning();

    return NextResponse.json({ note });
  } catch (error) {
    console.error("[API] notes POST error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
