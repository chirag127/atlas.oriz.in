import { NextRequest, NextResponse } from "next/server";
import { sendWithFallback } from "@/lib/ai/provider-registry";
import { initializeProviders } from "@/lib/ai/provider-registry";

export async function POST(request: NextRequest) {
  try {
    await initializeProviders();
    const { message, history, model, provider } = await request.json();

    const systemPrompt = history?.length
      ? undefined
      : "You are Atlas, a reading assistant. Answer questions about articles the user has read.";

    const prompt = history?.length
      ? [...history.map((m: { role: string; content: string }) => `${m.role}: ${m.content}`), `user: ${message}`].join("\n")
      : message;

    const response = await sendWithFallback(
      { prompt, systemPrompt, model, provider, stream: false },
      provider ? [provider] : undefined
    );

    return NextResponse.json({ content: response.content, model: response.model, provider: response.provider });
  } catch (error) {
    console.error("[AI Chat] error:", error);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
