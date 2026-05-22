import { NextRequest, NextResponse } from "next/server";
import { sendWithFallback, initializeProviders } from "@/lib/ai/provider-registry";
import { tagPrompt } from "@/lib/ai/prompts";

export async function POST(request: NextRequest) {
  try {
    await initializeProviders();
    const { title, summary, content } = await request.json();

    const response = await sendWithFallback({
      prompt: tagPrompt({ title, summary: summary ?? "", content: content ?? "" }),
      temperature: 0.3,
    });

    let tags: string[] = [];
    try {
      tags = JSON.parse(response.content);
    } catch {
      tags = response.content
        .replace(/[\[\]"]/g, "")
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
    }

    return NextResponse.json({ tags });
  } catch (error) {
    console.error("[AI Tags] error:", error);
    return NextResponse.json({ tags: [] });
  }
}
