import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { keywordAlerts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });
  const updated = await db.update(keywordAlerts).set(body).where(eq(keywordAlerts.id, id)).returning();
  return NextResponse.json(updated[0]);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!db) return NextResponse.json({ error: "No DB" }, { status: 503 });
  await db.delete(keywordAlerts).where(eq(keywordAlerts.id, id));
  return NextResponse.json({ success: true });
}
