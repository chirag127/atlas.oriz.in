import type { AIProvider, AIRequest, AIResponse } from "./types";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta";

async function send(req: AIRequest): Promise<AIResponse> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY not set");

  const model = req.model ?? "gemma-4-31b-it";
  const start = Date.now();

  const body = {
    contents: [{ role: "user", parts: [{ text: req.prompt }] }],
    ...(req.systemPrompt && {
      systemInstruction: { parts: [{ text: req.systemPrompt }] },
    }),
    generationConfig: {
      maxOutputTokens: req.maxTokens ?? 2048,
      temperature: req.temperature ?? 0.7,
    },
  };

  const res = await fetch(
    `${BASE_URL}/models/${model}:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  return {
    content,
    model,
    provider: "gemini",
    tokensUsed: {
      input: data.usageMetadata?.promptTokenCount ?? 0,
      output: data.usageMetadata?.candidatesTokenCount ?? 0,
    },
    duration: Date.now() - start,
  };
}

async function listModels() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return [];

  try {
    const res = await fetch(`${BASE_URL}/models?key=${key}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.models ?? [])
      .filter((m: { supportedGenerationMethods?: string[] }) =>
        m.supportedGenerationMethods?.includes("generateContent")
      )
      .map((m: { name: string; displayName?: string }) => ({
        id: m.name.replace("models/", ""),
        name: m.displayName ?? m.name,
        provider: "gemini",
        contextLength: 1000000,
        supportsVision: true,
        supportsTools: true,
        isFree: true,
        isReasoning: false,
      }));
  } catch {
    return [];
  }
}

const config: AIProvider = {
  id: "gemini",
  name: "Google Gemini",
  requiresKey: true,
  isClientSide: false,
  models: [],
  isConfigured: !!process.env.GEMINI_API_KEY,
};

export const geminiProvider = { impl: { send, listModels }, config };
