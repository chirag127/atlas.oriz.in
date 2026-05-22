import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });
  const items = await db.select().from(schema.notes).where(eq(schema.notes.articleId, id));
  return NextResponse.json(items);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { content } = await request.json();
  if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });
  const created = await db.insert(schema.notes).values({
    userId: "00000000-0000-0000-0000-000000000000",
    articleId: id,
    title: `Note for article ${id.slice(0, 8)}`,
    content: content ?? "",
  }).returning();
  return NextResponse.json(created[0], { status: 201 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { content } = await request.json();
  if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });
  const updated = await db.update(schema.notes).set({ content }).where(eq(schema.notes.id, id)).returning();
  return NextResponse.json(updated[0]);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });
  await db.delete(schema.notes).where(eq(schema.notes.id, id));
  return NextResponse.json({ success: true });
}
