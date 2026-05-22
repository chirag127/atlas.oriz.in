import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!db) {
      return NextResponse.json({ message: "No DB configured" });
    }

    // Simple query to keep Supabase alive
    await db.execute(sql`SELECT 1`);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: "Database keep-alive ping successful",
    });
  } catch (error) {
    console.error("[Cron] keep-alive error:", error);
    return NextResponse.json({ error: "Keep-alive failed" }, { status: 500 });
  }
}
