import type { AIProvider, AIRequest, AIResponse } from "./types";

const BASE_URL = "https://api.groq.com/openai/v1";

async function send(req: AIRequest): Promise<AIResponse> {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY not set");

  const model = req.model ?? "llama-3.3-70b-versatile";
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
    throw new Error(`Groq error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return {
    content: data.choices?.[0]?.message?.content ?? "",
    model,
    provider: "groq",
    tokensUsed: {
      input: data.usage?.prompt_tokens ?? 0,
      output: data.usage?.completion_tokens ?? 0,
    },
    duration: Date.now() - start,
  };
}

async function listModels() {
  const key = process.env.GROQ_API_KEY;
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
      provider: "groq",
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
  id: "groq",
  name: "Groq",
  requiresKey: true,
  isClientSide: false,
  models: [],
  isConfigured: !!process.env.GROQ_API_KEY,
};

export const groqProvider = { impl: { send, listModels }, config };
