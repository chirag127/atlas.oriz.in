import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { rating, difficulty, stability } = await request.json();

  if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });

  const updated = await db
    .update(schema.bookmarks)
    .set({
      lastReview: new Date(),
      ...(difficulty !== undefined && { difficulty }),
      ...(stability !== undefined && { stability }),
    })
    .where(eq(schema.bookmarks.id, id))
    .returning();

  return NextResponse.json(updated[0] ?? { error: "Not found" }, { status: updated[0] ? 200 : 404 });
}
