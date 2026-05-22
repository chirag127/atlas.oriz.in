import type { AIProvider, AIRequest, AIResponse } from "./types";

const BASE_URL = "https://openrouter.ai/api/v1";

export const FREE_MODELS = [
  "deepseek/deepseek-v4-flash:free",
  "minimax/minimax-m2.5:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "openai/gpt-oss-120b:free",
  "arcee-ai/trinity-large-thinking:free",
  "google/gemma-4-26b-a4b-it:free",
  "qwen/qwen3-coder:free",
  "openai/gpt-oss-20b:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "z-ai/glm-4.5-air:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "openrouter/owl-alpha",
  "openrouter/free",
  "baidu/cobuddy:free",
  "poolside/laguna-xs.2:free",
  "poolside/laguna-m.1:free",
  "nousresearch/hermes-3-llama-3.1-405b:free",
];

let modelRotationIndex = 0;

function getNextModel(): string {
  const model = FREE_MODELS[modelRotationIndex % FREE_MODELS.length];
  modelRotationIndex++;
  return model;
}

async function send(req: AIRequest): Promise<AIResponse> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY not set");

  const model = req.model ?? getNextModel();
  const start = Date.now();

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://atlas.oriz.in",
      "X-Title": "Atlas",
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
    throw new Error(`OpenRouter error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return {
    content: data.choices?.[0]?.message?.content ?? "",
    model,
    provider: "openrouter",
    tokensUsed: {
      input: data.usage?.prompt_tokens ?? 0,
      output: data.usage?.completion_tokens ?? 0,
    },
    duration: Date.now() - start,
  };
}

async function listModels() {
  try {
    const res = await fetch(`${BASE_URL}/models`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data ?? [])
      .filter((m: { pricing?: { prompt?: string } }) => m.pricing?.prompt === "0")
      .map((m: { id: string; name?: string; context_length?: number }) => ({
        id: m.id,
        name: m.name ?? m.id,
        provider: "openrouter",
        contextLength: m.context_length ?? 131072,
        supportsVision: false,
        supportsTools: true,
        isFree: true,
        isReasoning: false,
      }));
  } catch {
    return FREE_MODELS.map((id) => ({
      id,
      name: id.split("/")[1]?.replace(":free", "") ?? id,
      provider: "openrouter",
      contextLength: 131072,
      supportsVision: false,
      supportsTools: true,
      isFree: true,
      isReasoning: false,
    }));
  }
}

const config: AIProvider = {
  id: "openrouter",
  name: "OpenRouter",
  requiresKey: true,
  isClientSide: false,
  models: [],
  isConfigured: !!process.env.OPENROUTER_API_KEY,
};

export const openrouterProvider = { impl: { send, listModels }, config };
