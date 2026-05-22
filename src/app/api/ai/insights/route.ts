import { NextRequest, NextResponse } from "next/server";
import { sendWithFallback, initializeProviders } from "@/lib/ai/provider-registry";
import { insightsPrompt } from "@/lib/ai/prompts";

export async function POST(request: NextRequest) {
  try {
    await initializeProviders();
    const { title, content } = await request.json();

    const response = await sendWithFallback({
      prompt: insightsPrompt(title, content?.slice(0, 4000) ?? ""),
      temperature: 0.5,
      maxTokens: 1024,
    });

    let insights: string[] = [];
    try {
      const parsed = JSON.parse(response.content);
      insights = Array.isArray(parsed) ? parsed : parsed.insights ?? [];
    } catch {
      insights = response.content
        .split("\n")
        .map((l) => l.replace(/^\d+[\.\)]\s*/, "").trim())
        .filter(Boolean);
    }

    return NextResponse.json({ insights });
  } catch (error) {
    console.error("[AI Insights] error:", error);
    return NextResponse.json({ insights: [] });
  }
}
