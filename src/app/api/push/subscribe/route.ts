import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { pushSubscriptions } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, keys } = body;

    if (!endpoint || !keys) {
      return NextResponse.json({ error: "endpoint and keys required" }, { status: 400 });
    }

    if (!db) return NextResponse.json({ success: true });

    await db
      .insert(pushSubscriptions)
      .values({
        userId: "00000000-0000-0000-0000-000000000000",
        endpoint,
        keys,
        userAgent: request.headers.get("user-agent"),
      })
      .onConflictDoNothing();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] push subscribe error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
