import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { keywordAlerts } from "@/lib/db/schema";
import { desc } from "drizzle-orm";

export async function GET() {
  try {
    if (!db) return NextResponse.json({ alerts: [] });

    const results = await db
      .select()
      .from(keywordAlerts)
      .orderBy(desc(keywordAlerts.createdAt));

    return NextResponse.json({ alerts: results });
  } catch (error) {
    console.error("[API] alerts error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyword } = body;

    if (!keyword) return NextResponse.json({ error: "keyword required" }, { status: 400 });
    if (!db) return NextResponse.json({ success: true });

    const [alert] = await db
      .insert(keywordAlerts)
      .values({ userId: "00000000-0000-0000-0000-000000000000", keyword })
      .returning();

    return NextResponse.json({ alert });
  } catch (error) {
    console.error("[API] alerts POST error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
