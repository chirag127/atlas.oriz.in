import { NextRequest, NextResponse } from "next/server";
import { sendWithFallback, initializeProviders } from "@/lib/ai/provider-registry";

export async function POST(request: NextRequest) {
  try {
    await initializeProviders();
    const { url } = await request.json();

    const response = await sendWithFallback({
      prompt: `Given this URL: ${url}, suggest a title, category (from: tech, science, design, business, culture, politics, health, sports, entertainment, other), and whether it looks like a valid RSS/Atom feed URL. Respond as JSON: { "title": string, "category": string, "isValidFeed": boolean, "note": string }`,
      temperature: 0.3,
      maxTokens: 256,
    });

    let suggested: Record<string, unknown> = { isValidFeed: false };
    try {
      suggested = JSON.parse(response.content);
    } catch {
      suggested = { isValidFeed: false, note: "Could not parse feed info" };
    }

    return NextResponse.json(suggested);
  } catch (error) {
    console.error("[Feed Discovery] error:", error);
    return NextResponse.json({ isValidFeed: false, title: "", note: "Discovery failed" });
  }
}
