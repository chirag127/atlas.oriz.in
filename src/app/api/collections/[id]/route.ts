import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db/client";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });
  const items = await db.select().from(schema.collections).where(eq(schema.collections.userId, id));
  return NextResponse.json(items);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, description, icon } = await request.json();
  if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });
  const created = await db.insert(schema.collections).values({
    userId: id,
    name,
    description: description ?? null,
    icon: icon ?? "folder",
  }).returning();
  return NextResponse.json(created[0], { status: 201 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name, description, icon } = await request.json();
  if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });
  const updated = await db
    .update(schema.collections).set({ name, description, icon })
    .where(eq(schema.collections.id, id)).returning();
  return NextResponse.json(updated[0]);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });
  await db.delete(schema.collections).where(eq(schema.collections.id, id));
  return NextResponse.json({ success: true });
}
