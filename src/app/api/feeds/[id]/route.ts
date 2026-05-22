import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { feeds } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });
  const feed = await db.select().from(feeds).where(eq(feeds.id, id)).limit(1);
  if (!feed[0]) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(feed[0]);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });
  const updated = await db.update(feeds).set(body).where(eq(feeds.id, id)).returning();
  return NextResponse.json(updated[0]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });
  await db.delete(feeds).where(eq(feeds.id, id));
  return NextResponse.json({ success: true });
}
