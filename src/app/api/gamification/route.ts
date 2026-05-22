import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { gamificationStats } from "@/lib/db/schema";

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({
        stats: {
          currentStreak: 0,
          longestStreak: 0,
          totalArticlesRead: 0,
          curiosityScore: 0,
          learningScore: 0,
          topicsExplored: 0,
        },
      });
    }

    const [stats] = await db
      .select()
      .from(gamificationStats)
      .limit(1);

    return NextResponse.json({ stats: stats ?? { currentStreak: 0 } });
  } catch (error) {
    console.error("[API] gamification error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
