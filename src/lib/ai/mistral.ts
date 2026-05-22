import type { AIProvider, AIRequest, AIResponse } from "./types";

const BASE_URL = "https://api.mistral.ai/v1";

async function send(req: AIRequest): Promise<AIResponse> {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) throw new Error("MISTRAL_API_KEY not set");

  const model = req.model ?? "mistral-small-latest";
  const start = Date.now();

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model,
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
    throw new Error(`Mistral error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return {
    content: data.choices?.[0]?.message?.content ?? "",
    model,
    provider: "mistral",
    tokensUsed: {
      input: data.usage?.prompt_tokens ?? 0,
      output: data.usage?.completion_tokens ?? 0,
    },
    duration: Date.now() - start,
  };
}

async function listModels() {
  const key = process.env.MISTRAL_API_KEY;
  if (!key) return [];
  try {
    const res = await fetch(`${BASE_URL}/models`, {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data ?? []).map((m: { id: string; name?: string }) => ({
      id: m.id,
      name: m.name ?? m.id,
      provider: "mistral",
      contextLength: 131072,
      supportsVision: false,
      supportsTools: true,
      isFree: true,
      isReasoning: false,
    }));
  } catch {
    return [];
  }
}

const config: AIProvider = {
  id: "mistral",
  name: "Mistral",
  requiresKey: true,
  isClientSide: false,
  models: [],
  isConfigured: !!process.env.MISTRAL_API_KEY,
};

export const mistralProvider = { impl: { send, listModels }, config };
