import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { userSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({ settings: getDefaultSettings() });
    }

    const [settings] = await db
      .select()
      .from(userSettings)
      .limit(1);

    return NextResponse.json({ settings: settings ?? getDefaultSettings() });
  } catch (error) {
    console.error("[API] settings GET error:", error);
    return NextResponse.json({ settings: getDefaultSettings() });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!db) {
      return NextResponse.json({ success: true, message: "No DB — settings saved locally" });
    }

    const existing = await db.select().from(userSettings).limit(1);

    if (existing.length > 0) {
      await db
        .update(userSettings)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(userSettings.id, existing[0].id));
    } else {
      await db.insert(userSettings).values({
        userId: "00000000-0000-0000-0000-000000000000",
        ...body,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] settings PUT error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

function getDefaultSettings() {
  return {
    theme: "dark",
    fontSize: 18,
    fontFamily: "Newsreader",
    lineHeight: 1.7,
    maxContentWidth: 680,
    primaryAiProvider: "puter",
    aiProviderPriority: ["puter", "gemini", "groq", "openrouter"],
    autoSummarize: true,
    gamificationEnabled: true,
    pushEnabled: false,
    duckduckgoEnabled: true,
    discoveryFrequency: "hourly",
    indiaBoostEnabled: true,
    antiClickbaitStrength: "medium",
    onboardingComplete: false,
  };
}
