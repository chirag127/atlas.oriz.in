import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });
  const items = await db.select().from(schema.highlights).where(eq(schema.highlights.articleId, id));
  return NextResponse.json(items);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { text, color, note } = await request.json();
  if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });
  const created = await db.insert(schema.highlights).values({
    userId: "00000000-0000-0000-0000-000000000000",
    articleId: id,
    text,
    color: color ?? "yellow",
    note: note ?? null,
  }).returning();
  return NextResponse.json(created[0], { status: 201 });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });
  await db.delete(schema.highlights).where(eq(schema.highlights.id, id));
  return NextResponse.json({ success: true });
}
