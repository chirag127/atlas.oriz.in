import type { AIProvider, AIRequest, AIResponse } from "./types";

async function send(req: AIRequest): Promise<AIResponse> {
  const gatewayUrl = process.env.VERCEL_AI_GATEWAY_URL;
  if (!gatewayUrl) throw new Error("VERCEL_AI_GATEWAY_URL not set");
  const start = Date.now();

  const res = await fetch(`${gatewayUrl}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: req.model ?? "gpt-4o-mini",
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
    throw new Error(`Vercel AI Gateway error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return {
    content: data.choices?.[0]?.message?.content ?? "",
    model: req.model ?? "gpt-4o-mini",
    provider: "vercel-gateway",
    tokensUsed: {
      input: data.usage?.prompt_tokens ?? 0,
      output: data.usage?.completion_tokens ?? 0,
    },
    duration: Date.now() - start,
  };
}

async function listModels() {
  return [];
}

const config: AIProvider = {
  id: "vercel-gateway",
  name: "Vercel AI Gateway",
  requiresKey: true,
  isClientSide: false,
  models: [],
  isConfigured: !!process.env.VERCEL_AI_GATEWAY_URL,
};

export const vercelGatewayProvider = { impl: { send, listModels }, config };
