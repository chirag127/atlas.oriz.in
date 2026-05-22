import { NextRequest, NextResponse } from "next/server";
import { sendWithFallback, initializeProviders } from "@/lib/ai/provider-registry";
import { digestPrompt } from "@/lib/ai/prompts";

export async function POST(request: NextRequest) {
  try {
    await initializeProviders();
    const { articles } = await request.json();

    const articlesText = (articles ?? [])
      .map((a: { title: string; summary?: string }, i: number) => `${i + 1}. ${a.title}${a.summary ? ` — ${a.summary}` : ""}`)
      .join("\n");

    const response = await sendWithFallback({
      prompt: digestPrompt(articlesText),
      temperature: 0.5,
      maxTokens: 2048,
    });

    return NextResponse.json({ digest: response.content });
  } catch (error) {
    console.error("[AI Digest] error:", error);
    return NextResponse.json({ error: "Digest failed" }, { status: 500 });
  }
}
