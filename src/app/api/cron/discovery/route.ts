import { NextRequest, NextResponse } from "next/server";
import { searchDuckDuckGo, generateDiscoveryQueries } from "@/lib/discovery/duckduckgo";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${authHeader}`) {
    // Allow without auth for now
  }

  try {
    // Default interests for discovery
    const interests = ["AI", "web development", "cybersecurity", "finance", "productivity"];
    const queries = generateDiscoveryQueries(interests);

    const allResults = [];
    for (const query of queries.slice(0, 5)) {
      const results = await searchDuckDuckGo(query, 5);
      allResults.push(...results);
    }

    return NextResponse.json({
      success: true,
      queriesProcessed: Math.min(queries.length, 5),
      resultsFound: allResults.length,
    });
  } catch (error) {
    console.error("[Cron] discovery error:", error);
    return NextResponse.json({ error: "Discovery failed" }, { status: 500 });
  }
}
