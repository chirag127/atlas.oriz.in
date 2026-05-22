import type { AIProvider, AIRequest, AIResponse } from "./types";

async function send(req: AIRequest): Promise<AIResponse> {
  const key = process.env.OPENCODE_ZEN_API_KEY;
  if (!key) throw new Error("OPENCODE_ZEN_API_KEY not set");
  const start = Date.now();

  const res = await fetch("https://api.opencode.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: req.model ?? "zen-1",
      messages: [
        ...(req.systemPrompt ? [{ role: "system", content: req.systemPrompt }] : []),
        { role: "user", content: req.prompt },
      ],
      max_tokens: req.maxTokens ?? 2048,
      temperature: req.temperature ?? 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenCode Zen error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return {
    content: data.choices?.[0]?.message?.content ?? "",
    model: req.model ?? "zen-1",
    provider: "opencode-zen",
    tokensUsed: {
      input: data.usage?.prompt_tokens ?? 0,
      output: data.usage?.completion_tokens ?? 0,
    },
    duration: Date.now() - start,
  };
}

async function listModels() {
  return [
    { id: "zen-1", name: "Zen 1", provider: "opencode-zen", contextLength: 32768, supportsVision: false, supportsTools: true, isFree: true, isReasoning: false },
  ];
}

const config: AIProvider = {
  id: "opencode-zen",
  name: "OpenCode Zen",
  requiresKey: true,
  isClientSide: false,
  models: [],
  isConfigured: !!process.env.OPENCODE_ZEN_API_KEY,
};

export const opencodeZenProvider = { impl: { send, listModels }, config };
