import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { collections } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    if (!db) return NextResponse.json({ collections: [] });

    const results = await db
      .select()
      .from(collections)
      .orderBy(desc(collections.updatedAt));

    return NextResponse.json({ collections: results });
  } catch (error) {
    console.error("[API] collections GET error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, color, icon, isSmart, smartQuery } = body;

    if (!name) {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }

    if (!db) return NextResponse.json({ success: true });

    const [collection] = await db
      .insert(collections)
      .values({
        userId: "00000000-0000-0000-0000-000000000000",
        name,
        description,
        color: color ?? "emerald",
        icon: icon ?? "folder",
        isSmart: isSmart ?? false,
        smartQuery,
      })
      .returning();

    return NextResponse.json({ collection });
  } catch (error) {
    console.error("[API] collections POST error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
