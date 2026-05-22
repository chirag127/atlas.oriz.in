import { NextRequest, NextResponse } from "next/server";
import { searchDuckDuckGo } from "@/lib/discovery/duckduckgo";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") ?? "10");

    if (!query) {
      return NextResponse.json(
        { error: "q parameter required" },
        { status: 400 }
      );
    }

    const results = await searchDuckDuckGo(query, limit);

    return NextResponse.json({ results, query, source: "duckduckgo" });
  } catch (error) {
    console.error("[API] discovery error:", error);
    return NextResponse.json({ error: "Discovery failed" }, { status: 500 });
  }
}
