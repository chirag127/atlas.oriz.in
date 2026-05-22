import { NextRequest, NextResponse } from "next/server";
import { sendWithFallback, initializeProviders } from "@/lib/ai/provider-registry";
import { eli5Prompt } from "@/lib/ai/prompts";

export async function POST(request: NextRequest) {
  try {
    await initializeProviders();
    const { title, content } = await request.json();

    const response = await sendWithFallback({
      prompt: eli5Prompt(title, content?.slice(0, 3000) ?? ""),
      temperature: 0.7,
      maxTokens: 1024,
    });

    return NextResponse.json({ explanation: response.content });
  } catch (error) {
    console.error("[AI Explain] error:", error);
    return NextResponse.json({ error: "Explanation failed" }, { status: 500 });
  }
}
