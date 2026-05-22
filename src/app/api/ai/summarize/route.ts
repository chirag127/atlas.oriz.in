import { NextRequest, NextResponse } from "next/server";
import { sendWithFallback } from "@/lib/ai/provider-registry";
import { PROMPTS } from "@/lib/ai/prompts";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task, title, content, url, question } = body;

    if (!task || !title) {
      return NextResponse.json(
        { error: "task and title are required" },
        { status: 400 }
      );
    }

    let prompt: string;
    let systemPrompt: string;

    switch (task) {
      case "tldr":
        systemPrompt = PROMPTS.tldr.system;
        prompt = PROMPTS.tldr.build(title, content ?? "");
        break;
      case "insights":
        systemPrompt = PROMPTS.insights.system;
        prompt = PROMPTS.insights.build(title, content ?? "");
        break;
      case "eli5":
        systemPrompt = PROMPTS.eli5.system;
        prompt = PROMPTS.eli5.build(title, content ?? "");
        break;
      case "tags":
        systemPrompt = PROMPTS.tags.system;
        prompt = PROMPTS.tags.build(title, content ?? "");
        break;
      case "chat":
        if (!question) {
          return NextResponse.json(
            { error: "question required for chat" },
            { status: 400 }
          );
        }
        systemPrompt = PROMPTS.chat.system;
        prompt = PROMPTS.chat.build(title, content ?? "", question);
        break;
      case "summarize":
      default:
        systemPrompt = PROMPTS.summarize.system;
        prompt = PROMPTS.summarize.build(title, content ?? "");
        break;
    }

    const response = await sendWithFallback({
      prompt,
      systemPrompt,
      maxTokens: task === "tags" ? 200 : 1024,
      temperature: task === "tags" ? 0.3 : 0.7,
    });

    return NextResponse.json({
      content: response.content,
      model: response.model,
      provider: response.provider,
      duration: response.duration,
    });
  } catch (error) {
    console.error("[API] AI summarize error:", error);
    return NextResponse.json(
      {
        error: "AI request failed",
        message: error instanceof Error ? error.message : "Unknown error",
        hint: "Configure an AI provider in Settings → AI Providers, or add API keys to .env.local",
      },
      { status: 500 }
    );
  }
}
